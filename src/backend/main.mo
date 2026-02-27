import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  func nowInMillis() : Int {
    Time.now() / 1_000_000;
  };

  module MenuItem {
    func compareByCategoryThenRating(item1 : MenuItem, item2 : MenuItem) : Order.Order {
      switch (Text.compare(item1.category, item2.category)) {
        case (#equal) { Nat.compare(item2.rating, item1.rating) };
        case (order) { order };
      };
    };
  };

  type MenuItem = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text; // Beverages/Breakfast/Mains/Desserts/Combos
    price : Nat; // in paise
    imageUrl : Text;
    dietaryTags : [Text];
    spiceLevel : Nat; // 0-3
    isAvailable : Bool;
    isChefRecommended : Bool;
    rating : Nat; // 0-50
  };

  type Booking = {
    id : Nat;
    customerName : Text;
    customerPhone : Text;
    partySize : Nat;
    date : Text;
    timeSlot : Text;
    eventType : Text;
    specialRequests : Text;
    status : Text; // Pending/Confirmed/Cancelled
    createdAt : Int;
  };

  type Member = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    totalPoints : Nat;
    tier : Text; // Bronze/Silver/Gold
    referralCode : Text;
    joinedAt : Int;
    totalVisits : Nat;
  };

  type Review = {
    id : Nat;
    customerName : Text;
    rating : Nat; // 1-5
    comment : Text;
    createdAt : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  var nextMenuItemId = 1;
  var nextBookingId = 1;
  var nextMemberId = 1;
  var nextReviewId = 1;

  let menuItems = Map.empty<Nat, MenuItem>();
  let bookings = Map.empty<Nat, Booking>();
  let members = Map.empty<Nat, Member>();
  let reviews = Map.empty<Nat, Review>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // USER PROFILE MANAGEMENT

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // 1. MENU ITEMS

  public shared ({ caller }) func addMenuItem(item : MenuItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add menu items");
    };

    let newItem = { item with id = nextMenuItemId };
    menuItems.add(nextMenuItemId, newItem);
    nextMenuItemId += 1;
  };

  public shared ({ caller }) func updateMenuItem(id : Nat, item : MenuItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update menu items");
    };

    if (not (menuItems.containsKey(id))) {
      Runtime.trap("Menu item not found");
    };

    let updatedItem = { item with id };
    menuItems.add(id, updatedItem);
  };

  public shared ({ caller }) func deleteMenuItem(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete menu items");
    };

    if (not (menuItems.containsKey(id))) {
      Runtime.trap("Menu item not found");
    };

    menuItems.remove(id);
  };

  public shared ({ caller }) func toggleMenuItemAvailability(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle menu item availability");
    };

    switch (menuItems.get(id)) {
      case (null) { Runtime.trap("Menu item not found") };
      case (?item) {
        let updatedItem = { item with isAvailable = not item.isAvailable };
        menuItems.add(id, updatedItem);
      };
    };
  };

  public query func getAllMenuItems() : async [MenuItem] {
    menuItems.values().toArray();
  };

  public query func getMenuItemsByCategory(category : Text) : async [MenuItem] {
    menuItems.values().filter(func(item) { item.category == category }).toArray();
  };

  // 2. TABLE BOOKINGS

  public shared ({ caller }) func createBooking(booking : Booking) : async Nat {
    // Public function - anyone can create a booking, no authorization check needed
    let newBooking = {
      booking with
      id = nextBookingId;
      status = "Pending";
      createdAt = nowInMillis();
    };

    bookings.add(nextBookingId, newBooking);
    nextBookingId += 1;
    nextBookingId - 1;
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };

    bookings.values().toArray();
  };

  public query ({ caller }) func getBookingsForDate(date : Text) : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view bookings by date");
    };

    bookings.values().filter(func(b) { b.date == date }).toArray();
  };

  public shared ({ caller }) func updateBookingStatus(id : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update booking status");
    };

    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking = { booking with status };
        bookings.add(id, updatedBooking);
      };
    };
  };

  public shared ({ caller }) func cancelBooking(id : Nat, phone : Text) : async () {
    // Public function with ownership verification - anyone can cancel if phone matches
    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        if (booking.customerPhone != phone) {
          Runtime.trap("Phone number does not match");
        };
        let updatedBooking = { booking with status = "Cancelled" };
        bookings.add(id, updatedBooking);
      };
    };
  };

  public query func isSlotAvailable(date : Text, timeSlot : Text) : async Bool {
    // Public query - anyone can check slot availability
    let bookingsForSlot = bookings.values().filter(func(b) { b.date == date and b.timeSlot == timeSlot and b.status != "Cancelled" }).toArray();
    bookingsForSlot.size() < 5;
  };

  // 3. LOYALTY MEMBERS

  public shared ({ caller }) func registerMember(member : Member) : async () {
    // Public function - anyone can register as a member, no authorization check needed
    let newMember = {
      member with
      id = nextMemberId;
      totalPoints = 0;
      tier = "Bronze";
      joinedAt = nowInMillis();
      totalVisits = 0;
    };

    members.add(nextMemberId, newMember);
    nextMemberId += 1;
  };

  public query func getMemberByPhone(phone : Text) : async ?Member {
    // Public query - anyone can look up a member by phone
    let allMembers = members.values().toArray();
    allMembers.find(func(m) { m.phone == phone });
  };

  func getTier(points : Nat) : Text {
    if (points >= 2000) { "Gold" } else { if (points >= 500) { "Silver" } else { "Bronze" } };
  };

  public shared ({ caller }) func addMemberPoints(memberId : Nat, points : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add member points");
    };

    switch (members.get(memberId)) {
      case (null) { Runtime.trap("Member not found") };
      case (?member) {
        let newTotalPoints = member.totalPoints + points;
        let updatedMember = {
          member with
          totalPoints = newTotalPoints;
          tier = getTier(newTotalPoints);
        };
        members.add(memberId, updatedMember);
      };
    };
  };

  public query ({ caller }) func getAllMembers() : async [Member] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all members");
    };

    members.values().toArray();
  };

  // 4. REVIEWS

  public shared ({ caller }) func submitReview(review : Review) : async () {
    // Public function - anyone can submit a review, no authorization check needed
    let newReview = {
      review with
      id = nextReviewId;
      createdAt = nowInMillis();
    };

    reviews.add(nextReviewId, newReview);
    nextReviewId += 1;
  };

  public query func getAllReviews() : async [Review] {
    // Public query - anyone can view all reviews
    reviews.values().toArray();
  };

  public shared ({ caller }) func deleteReview(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete reviews");
    };

    if (not (reviews.containsKey(id))) {
      Runtime.trap("Review not found");
    };

    reviews.remove(id);
  };
};
