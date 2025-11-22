import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromStorage, logoutUser } from "../utils/auth";
import axiosInstance from "../utils/axios";
import { toast } from "react-toastify";
import { User, Phone, Lock, ArrowLeft, Save, Home, LogOut } from "lucide-react";
import { LoadingButton } from "./LoadingButton";

export default function Account() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    const [profileData, setProfileData] = useState({
        name: "",
        userPhone: "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            const storedUser = getUserFromStorage();
            if (!storedUser) {
                navigate("/login");
                return;
            }

            const response = await axiosInstance.get("/auth/profile");
            setUser(response.data);
            setProfileData({
                name: response.data.name || "",
                userPhone: response.data.userPhone || "",
            });
        } catch (error) {
            console.error("Error loading profile:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            } else {
                toast.error("Failed to load profile");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        
        if (!profileData.name.trim()) {
            toast.error("Name is required");
            return;
        }

        try {
            setIsSavingProfile(true);
            const response = await axiosInstance.put("/auth/profile", profileData);
            setUser(response.data.user);
            setIsEditingProfile(false);
            toast.success("Profile updated successfully!");
            
            // Update local storage
            const storedUser = getUserFromStorage();
            if (storedUser) {
                localStorage.setItem("user", JSON.stringify(response.data.user));
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error("All password fields are required");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        try {
            setIsSavingPassword(true);
            await axiosInstance.put("/auth/change-password", {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            
            setIsChangingPassword(false);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            toast.success("Password changed successfully!");
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setIsSavingPassword(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate("/");
            toast.success("Logged out successfully!");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Logout failed");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-900 text-xl font-semibold">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                        >
                            <ArrowLeft size={20} />
                            <span className="hidden sm:inline">Back</span>
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                        >
                            <Home size={20} />
                            <span className="hidden sm:inline">Home</span>
                        </button>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Account</h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
                        <LogOut size={18} />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>

                {/* Profile Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <User size={24} className="text-gray-700" />
                            Profile Information
                        </h2>
                        {!isEditingProfile && (
                            <button
                                onClick={() => setIsEditingProfile(true)}
                                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {isEditingProfile ? (
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={profileData.userPhone}
                                    onChange={(e) => setProfileData({ ...profileData, userPhone: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                                />
                                <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <LoadingButton
                                    type="submit"
                                    isLoading={isSavingProfile}
                                    loadingText="Saving..."
                                    className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </LoadingButton>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditingProfile(false);
                                        setProfileData({
                                            name: user?.name || "",
                                            userPhone: user?.userPhone || "",
                                        });
                                    }}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="border-b border-gray-100 pb-4">
                                <p className="text-gray-500 text-sm font-medium mb-1">Name</p>
                                <p className="text-gray-900 text-lg font-medium">{user?.name || "Not set"}</p>
                            </div>
                            <div className="border-b border-gray-100 pb-4">
                                <p className="text-gray-500 text-sm font-medium mb-1">Email</p>
                                <p className="text-gray-900 text-lg">{user?.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">Phone Number</p>
                                <p className="text-gray-900 text-lg">{user?.userPhone || "Not set"}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Password Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Lock size={24} className="text-gray-700" />
                            Change Password
                        </h2>
                        {!isChangingPassword && (
                            <button
                                onClick={() => setIsChangingPassword(true)}
                                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
                            >
                                Change Password
                            </button>
                        )}
                    </div>

                    {isChangingPassword ? (
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <LoadingButton
                                    type="submit"
                                    isLoading={isSavingPassword}
                                    loadingText="Changing..."
                                    className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                                >
                                    <Lock size={18} />
                                    Change Password
                                </LoadingButton>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsChangingPassword(false);
                                        setPasswordData({
                                            currentPassword: "",
                                            newPassword: "",
                                            confirmPassword: "",
                                        });
                                    }}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-gray-600">
                            Click "Change Password" to update your password
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
