import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MenuItem {
    id: bigint;
    isChefRecommended: boolean;
    name: string;
    isAvailable: boolean;
    description: string;
    imageUrl: string;
    dietaryTags: Array<string>;
    spiceLevel: bigint;
    category: string;
    rating: bigint;
    price: bigint;
}
export interface Member {
    id: bigint;
    referralCode: string;
    name: string;
    joinedAt: bigint;
    tier: string;
    email: string;
    totalVisits: bigint;
    totalPoints: bigint;
    phone: string;
}
export interface Booking {
    id: bigint;
    customerName: string;
    status: string;
    customerPhone: string;
    date: string;
    specialRequests: string;
    createdAt: bigint;
    partySize: bigint;
    timeSlot: string;
    eventType: string;
}
export interface UserProfile {
    name: string;
}
export interface Review {
    id: bigint;
    customerName: string;
    createdAt: bigint;
    comment: string;
    rating: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMemberPoints(memberId: bigint, points: bigint): Promise<void>;
    addMenuItem(item: MenuItem): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelBooking(id: bigint, phone: string): Promise<void>;
    createBooking(booking: Booking): Promise<bigint>;
    deleteMenuItem(id: bigint): Promise<void>;
    deleteReview(id: bigint): Promise<void>;
    getAllBookings(): Promise<Array<Booking>>;
    getAllMembers(): Promise<Array<Member>>;
    getAllMenuItems(): Promise<Array<MenuItem>>;
    getAllReviews(): Promise<Array<Review>>;
    getBookingsForDate(date: string): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMemberByPhone(phone: string): Promise<Member | null>;
    getMenuItemsByCategory(category: string): Promise<Array<MenuItem>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isSlotAvailable(date: string, timeSlot: string): Promise<boolean>;
    registerMember(member: Member): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitReview(review: Review): Promise<void>;
    toggleMenuItemAvailability(id: bigint): Promise<void>;
    updateBookingStatus(id: bigint, status: string): Promise<void>;
    updateMenuItem(id: bigint, item: MenuItem): Promise<void>;
}
