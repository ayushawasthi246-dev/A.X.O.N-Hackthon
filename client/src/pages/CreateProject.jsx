import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { userInfo } from "../store/authstore.jsx";
import { ProjectStore } from "../store/Projectstore.jsx";
import { useNavigate } from "react-router-dom";

export default function CreateProject() {

  const navigate = useNavigate()
  const { ProjectCreate } = ProjectStore();
  const { UserList , checkLeaderAuth, accessToken} = userInfo();

  useEffect(() => {
    const AuthenticationCheck = async () => {
      await checkLeaderAuth();
    };
    AuthenticationCheck();
  }, [accessToken, checkLeaderAuth]);


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [addMemberMode, setAddMemberMode] = useState(false);
  const [users, setUsers] = useState([]); // Original list from DB
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered list for search
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("");
  const [team, setTeam] = useState([]);

  // 1. Fetch Users logic - Extracting the array correctly
  const fetchUsers = async () => {
    const res = await UserList();
    // Your backend returns { success: true, data: { MembersList: [...] } }
    // Based on your console log: res.data.MembersList is the array
    if (res.success && res.data?.MembersList) {
      const userArray = res.data.MembersList;
      setUsers(userArray);
      setFilteredUsers(userArray);
    } else {
      setUsers([]);
      setFilteredUsers([]);
    }
  };

  useEffect(() => {
    if (addMemberMode) {
      fetchUsers();
    }
  }, [addMemberMode]);

  // 2. Search logic
  const handleSearch = (value) => {
    setSearch(value);
    if (!value.trim()) {
      setFilteredUsers(users);
      return;
    }
    const filtered = users.filter((u) =>
      (u.Username || u.name || "").toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const isAlreadyAdded = (id) => {
    return team.some((m) => m._id === id);
  };

  // 3. Final Submit
  const onSubmit = async (data) => {
    try {
      const payload = {
        ProjectName: data.ProjectName,
        ProjectDescription: data.ProjectDetail,
        RepoLink: data.RepoName,
        memberList: team.map((m) => ({
          member_ID: m._id,
          role: m.role,
        })),
      }

      console.log("Payload : ", payload)
      const res = await ProjectCreate(payload);

      if (res.success) {
        alert("Project Created Successfully!");
        navigate("/ProjectList")
        reset();
        setTeam([]);
        setAddMemberMode(false);
      }
    } catch (error) {
      console.error("Submission Error:", error);
    }
  };

  return (
    <div className="bg-[#0e0e0e] min-h-screen text-white flex flex-col items-center p-6 relative overflow-hidden">
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-neutral-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black text-cyan-400">A.X.O.N.</span>
          <span className="px-2 py-0.5 bg-cyan-400/10 text-cyan-400 text-[10px] rounded border border-cyan-400/20">V-2.4 Core</span>
        </div>
      </header>

      <main className="w-full max-w-2xl mt-20 mb-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full ${!addMemberMode ? "w-1/2" : "w-full"} bg-gradient-to-r from-purple-500 to-cyan-400`}></div>
          </div>
          <span className="text-xs text-cyan-400">Step {!addMemberMode ? "1" : "2"} of 2</span>
        </div>

        <section className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-10">
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-2">Create New Project</h1>
            <p className="text-gray-400">Set up your project and start collaborating.</p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {!addMemberMode ? (
              <>
                <div>
                  <label className="text-xs text-gray-400 uppercase">Project Name</label>
                  <input {...register("ProjectName", { required: true })} className="w-full mt-2 bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:border-cyan-400 outline-none" placeholder="Enter project name" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase">Project Description</label>
                  <textarea {...register("ProjectDetail", { required: true })} rows="3" className="w-full mt-2 bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:border-cyan-400 outline-none" placeholder="Describe your project..." />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase">GitHub Repository</label>
                  <input {...register("RepoName", { required: true })} className="w-full mt-2 bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:border-cyan-400 outline-none" placeholder="https://github.com/username/repo" />
                </div>
              </>
            ) : (
              <div className="pt-4 border-t border-white/10">
                <label className="text-xs text-gray-400 uppercase block mb-2">Search Members</label>
                <input type="text" value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Type name or email..." className="w-full mb-4 bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-cyan-400 outline-none" />

                <div className="max-h-40 overflow-y-auto space-y-2 mb-4 custom-scrollbar">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => !isAlreadyAdded(user._id) && setSelectedUser(user)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          isAlreadyAdded(user._id) ? "opacity-30 cursor-not-allowed bg-white/5" : "hover:border-cyan-400 border-white/10 bg-white/5 hover:bg-white/10"
                        } ${selectedUser?._id === user._id ? "border-cyan-400 bg-cyan-400/10" : ""}`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{user.Username || user.name}</span>
                          <span className="text-[10px] text-gray-500">{user.Email}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 text-sm">No users found</p>
                  )}
                </div>

                {selectedUser && (
                  <div className="space-y-3 border border-cyan-400/30 bg-cyan-400/5 p-4 rounded-lg animate-in fade-in duration-300">
                    <p className="text-sm">Assign role to <span className="text-cyan-400 font-bold">{selectedUser.Username || selectedUser.name}</span></p>
                    <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Frontend Developer" className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-2 focus:border-cyan-400 outline-none" />
                    <button
                      type="button"
                      disabled={!role}
                      onClick={() => {
                        setTeam([...team, { ...selectedUser, role, name: selectedUser.Username || selectedUser.name }]);
                        setSelectedUser(null);
                        setRole("");
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Add to Team
                    </button>
                  </div>
                )}

                <div className="mt-6 space-y-2">
                  <p className="text-xs text-gray-400 uppercase">Current Team ({team.length})</p>
                  {team.map((m, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/10 p-3 rounded-lg border border-white/5">
                      <div>
                        <p className="text-sm font-medium">{m.name}</p>
                        <p className="text-[11px] text-cyan-400">{m.role}</p>
                      </div>
                      <button type="button" onClick={() => setTeam(team.filter((_, idx) => idx !== i))} className="text-red-400 hover:bg-red-400/10 p-2 rounded-full transition-colors">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {!addMemberMode ? (
                <button type="button" onClick={() => setAddMemberMode(true)} className="btn flex-1 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold cursor-pointer py-3 rounded-lg transition-colors">
                  Next
                </button>
              ) : (
                <>
                  <button type="submit" className="btn flex-1 bg-cyan-400 hover:bg-cyan-300 text-black font-bold py-3 rounded-lg transition-colors cursor-pointer">
                    Create Project
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  reset();
                  setTeam([]);
                  setAddMemberMode(false);
                }}
                className="btn flex-1 border cursor-pointer border-white text-white hover:bg-white/10 py-3 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}