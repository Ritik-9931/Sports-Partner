import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  Clock,
  Gamepad2,
  Mail,
  MapPin,
  Shield,
  User,
} from "lucide-react";
import { fetchUserProfileById } from "../redux/slices/userSlice";

const ViewProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    viewedProfile: profile,
    loading,
    error,
  } = useSelector((state) => state.userInfo);

  useEffect(() => {
    dispatch(fetchUserProfileById(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-3xl rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-red-300">
          {error}
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-900"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900 shadow-xl">
          <div className="h-52 bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600" />

          <div className="px-6 pb-10 md:px-8">
            <div className="-mt-20 flex flex-col items-center">
              <img
                src={profile.profileImage || "https://via.placeholder.com/150"}
                alt={profile.name}
                className="h-40 w-40 rounded-full border-4 border-slate-900 object-cover shadow-lg"
              />

              <h1 className="mt-4 text-3xl font-bold">{profile.name}</h1>

              <p className="mt-2 flex items-center gap-2 text-slate-400">
                <MapPin size={18} />
                {profile.city || "City not added"}
                {profile.state ? `, ${profile.state}` : ""}
              </p>
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
                <h2 className="mb-5 text-xl font-bold">Personal Info</h2>

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
                    <span>{profile.skillLevel || "Beginner"}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950 p-6">
                <h2 className="mb-5 text-xl font-bold">Bio</h2>
                <p className="leading-7 text-slate-300">
                  {profile.bio || "No bio added yet."}
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-lg border border-slate-800 bg-slate-950 p-6">
              <h2 className="mb-5 text-xl font-bold">Preferred Games</h2>

              <div className="flex flex-wrap gap-3">
                {profile.preferredGames?.length > 0 ? (
                  profile.preferredGames.map((game) => (
                    <span
                      key={game._id}
                      className="rounded-full bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300"
                    >
                      {game.name}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-400">No games selected.</p>
                )}
              </div>
            </div>

            <div className="mt-10 rounded-lg border border-slate-800 bg-slate-950 p-6">
              <h2 className="mb-5 text-xl font-bold">Availability</h2>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {profile.availability?.length > 0 ? (
                  profile.availability.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-slate-800 bg-slate-900 p-4"
                    >
                      <p className="font-semibold">{item.day}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {item.startTime} - {item.endTime}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400">No availability added.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
