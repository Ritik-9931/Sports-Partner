import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyPlayRequests,
  updatePlayRequestStatus,
} from "../redux/slices/playRequestSlice";
import { fetchProfile } from "../redux/slices/userSlice";

const PlayRequests = () => {
  const dispatch = useDispatch();

  const { playRequests, loading, actionLoading, error } = useSelector(
    (state) => state.playRequests,
  );

  const { profile } = useSelector((state) => state.userInfo);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchMyPlayRequests());
  }, [dispatch]);

  const userId = profile?._id || profile?.id;

  const isReceiver = (request) =>
    String(request.receiver?._id || request.receiver) === String(userId);

  const isSender = (request) =>
    String(request.sender?._id || request.sender) === String(userId);

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Play Requests</h1>
          <p className="mt-2 text-slate-400">
            Manage sent and received play invitations.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-slate-400">
            Loading requests...
          </div>
        ) : (
          <div className="space-y-5">
            {playRequests.map((request) => (
              <div
                key={request._id}
                className="rounded-lg border border-slate-800 bg-slate-900 p-5"
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {request.game?.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {isSender(request)
                        ? `To: ${request.receiver?.name}`
                        : `From: ${request.sender?.name}`}
                    </p>

                    {request.message && (
                      <p className="mt-3 text-slate-300">{request.message}</p>
                    )}

                    {request.scheduleDate && (
                      <p className="mt-2 text-sm text-slate-400">
                        {new Date(request.scheduleDate).toLocaleString()}
                      </p>
                    )}

                    {request.meetingLocation?.address && (
                      <p className="mt-2 text-sm text-slate-400">
                        {request.meetingLocation.address}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 md:items-end">
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300">
                      {request.status}
                    </span>

                    {request.status === "pending" && isReceiver(request) && (
                      <div className="flex gap-3">
                        <button
                          disabled={actionLoading}
                          onClick={() =>
                            dispatch(
                              updatePlayRequestStatus({
                                requestId: request._id,
                                status: "accepted",
                              }),
                            )
                          }
                          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold hover:bg-emerald-600 disabled:opacity-60"
                        >
                          Accept
                        </button>

                        <button
                          disabled={actionLoading}
                          onClick={() =>
                            dispatch(
                              updatePlayRequestStatus({
                                requestId: request._id,
                                status: "rejected",
                              }),
                            )
                          }
                          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold hover:bg-red-600 disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {request.status === "pending" && isSender(request) && (
                      <button
                        disabled={actionLoading}
                        onClick={() =>
                          dispatch(
                            updatePlayRequestStatus({
                              requestId: request._id,
                              status: "cancelled",
                            }),
                          )
                        }
                        className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-600 disabled:opacity-60"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {playRequests.length === 0 && (
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-slate-400">
                No play requests found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayRequests;
