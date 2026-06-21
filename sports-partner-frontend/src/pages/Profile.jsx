import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  updateLocation,
  updatePrivacy,
  updateProfile,
} from "../redux/slices/userSlice";

import {
  Activity,
  Clock,
  Gamepad2,
  Mail,
  MapPin,
  Shield,
  User,
} from "lucide-react";

import LocationPicker from "../components/LocationPicker";

const Profile = () => {
  const dispatch = useDispatch();

  const { profile, loading } = useSelector((state) => state.userInfo);

  const [privacy, setPrivacy] = useState("hidden");
  const [liveTracking, setLiveTracking] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState("");

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setPrivacy(profile.locationPrivacy || "hidden");
      setLiveTracking(profile.liveTrackingEnabled || false);
      setLatitude(profile.location?.coordinates?.[1] || "");
      setLongitude(profile.location?.coordinates?.[0] || "");
      setAddress(profile.address || "");

      setName(profile.name || "");
      setBio(profile.bio || "");
      setPreviewImage(profile.profileImage || "");
    }
  }, [profile]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleProfileUpdate = () => {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("bio", bio);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    dispatch(updateProfile(formData));
  };

  const handlePrivacyUpdate = () => {
    dispatch(
      updatePrivacy({
        locationPrivacy: privacy,
        liveTrackingEnabled: liveTracking,
      }),
    );
  };

  const handleLocationUpdate = () => {
    dispatch(
      updateLocation({
        latitude,
        longitude,
        address,
      }),
    );
  };

  const locateMe = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude);
        const lng = Number(pos.coords.longitude);

        setLatitude(lat);
        setLongitude(lng);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
          );

          const data = await res.json();

          if (data.display_name) {
            setAddress(data.display_name);
          }
        } catch {
          alert("Location found, but address could not be loaded");
        }
      },
      () => {
        alert("Unable to access your location");
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      },
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        Loading Profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        No Profile Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900 shadow-xl">
          <div className="h-52 bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600" />

          <div className="px-6 pb-10 md:px-8">
            <div className="-mt-20 flex flex-col items-center">
              <img
                src={previewImage || "https://via.placeholder.com/150"}
                alt={profile.name}
                className="h-40 w-40 rounded-full border-4 border-slate-900 object-cover shadow-lg"
              />

              <label className="mt-3 cursor-pointer rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </label>

              <h1 className="mt-4 text-3xl font-bold">{profile.name}</h1>

              <p className="mt-2 flex items-center gap-2 text-slate-400">
                <MapPin size={18} />
                {profile.city || "City not added"}
                {profile.state ? `, ${profile.state}` : ""}
              </p>
            </div>

            <div className="mt-10 rounded-lg border border-slate-800 bg-slate-950 p-6">
              <h2 className="mb-5 text-xl font-bold">Edit Profile</h2>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Name
                  </label>

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Bio
                  </label>

                  <input
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write something about yourself"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <button
                onClick={handleProfileUpdate}
                className="mt-5 rounded-lg bg-violet-500 px-5 py-3 font-semibold text-white hover:bg-violet-600"
              >
                Save Profile
              </button>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-5">
                <Activity className="mb-2 text-emerald-400" />
                <h3 className="text-sm text-slate-400">Status</h3>
                <p className="font-bold">
                  {profile.isOnline ? "Online" : "Offline"}
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950 p-5">
                <Gamepad2 className="mb-2 text-violet-400" />
                <h3 className="text-sm text-slate-400">Games</h3>
                <p className="font-bold">
                  {profile.preferredGames?.length || 0}
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950 p-5">
                <Clock className="mb-2 text-amber-400" />
                <h3 className="text-sm text-slate-400">Last Seen</h3>
                <p className="text-sm font-medium">
                  {profile.lastSeen
                    ? new Date(profile.lastSeen).toLocaleString()
                    : "Not available"}
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-6">
                <h2 className="mb-5 text-xl font-bold">Personal Information</h2>

                <div className="space-y-4 text-slate-300">
                  <div className="flex gap-3">
                    <Mail className="text-slate-500" />
                    <span>{profile.email}</span>
                  </div>

                  <div className="flex gap-3">
                    <User className="text-slate-500" />
                    <span>{profile.gender || "Gender not added"}</span>
                  </div>

                  <div className="flex gap-3">
                    <Shield className="text-slate-500" />
                    <span className="capitalize">{profile.role}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950 p-6">
                <h2 className="mb-5 text-xl font-bold">Privacy Settings</h2>

                <div className="space-y-4">
                  <select
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 outline-none focus:border-violet-500"
                  >
                    <option value="hidden">Hidden</option>
                    <option value="distance_only">Distance Only</option>
                    <option value="live_location">Live Location</option>
                  </select>

                  <label className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-4">
                    <span>Live Tracking</span>

                    <input
                      type="checkbox"
                      checked={liveTracking}
                      onChange={(e) => setLiveTracking(e.target.checked)}
                    />
                  </label>

                  <button
                    onClick={handlePrivacyUpdate}
                    className="w-full rounded-lg bg-violet-500 py-3 font-semibold text-white hover:bg-violet-600"
                  >
                    Save Privacy Settings
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-lg border border-slate-800 bg-slate-950 p-6">
              <h2 className="mb-5 text-xl font-bold">Location Settings</h2>

              <div className="mb-4">
                <label className="mb-2 block font-medium text-slate-300">
                  Address
                </label>

                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full address"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
                />
              </div>

              <button
                onClick={locateMe}
                className="mb-5 rounded-lg bg-blue-500 px-4 py-2.5 font-semibold text-white hover:bg-blue-600"
              >
                Locate Me
              </button>

              <LocationPicker
                latitude={latitude}
                longitude={longitude}
                onLocationSelect={(lat, lng, selectedAddress) => {
                  setLatitude(lat);
                  setLongitude(lng);

                  if (selectedAddress) {
                    setAddress(selectedAddress);
                  }
                }}
              />

              <div className="mt-5 rounded-lg border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-200">
                Your exact location is used for nearby partner matching. Other
                users should only receive distance unless you allow live
                location.
              </div>

              <button
                onClick={handleLocationUpdate}
                className="mt-5 w-full rounded-lg bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-600"
              >
                Save Location
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
