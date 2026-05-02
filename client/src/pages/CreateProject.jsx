import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ProjectStore } from "../store/Projectstore.jsx";

export default function CreateProject() {

  const { ProjectCreate, UserList } = ProjectStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [addMemberMode, setAddMemberMode] = useState(false);

  // 🔥 New states
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("");
  const [team, setTeam] = useState([]);

  // 🚀 Fetch users when entering Step 2
  useEffect(() => {
    if (addMemberMode) {
      fetchUsers();
    }
  }, [addMemberMode]);

  const fetchUsers = async () => {
    const res = await UserList();
    if (res.success) {
      setUsers(res.data);
      setFilteredUsers(res.data);
    }
  };

  // 🔍 Search logic
  const handleSearch = (value) => {
    setSearch(value);

    const filtered = users.filter((u) =>
      u.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredUsers(filtered);
  };

  // ❌ Prevent duplicate users
  const isAlreadyAdded = (id) => {
    return team.some((m) => m._id === id);
  };

  // 🚀 Submit
  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        members: team,
      };

      const res = await ProjectCreate(payload);

      if (res.success) {
        console.log("SUCCESS:", res.message);
        reset();
        setTeam([]);
        setAddMemberMode(false);
      } else {
        console.log("ERROR:", res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#0e0e0e] min-h-screen text-white flex flex-col items-center p-6 relative overflow-hidden">

      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-neutral-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black text-cyan-400">A.X.O.N.</span>
          <span className="px-2 py-0.5 bg-cyan-400/10 text-cyan-400 text-[10px] rounded border border-cyan-400/20">
            V-2.4 Core
          </span>
        </div>
      </header>

      <main className="w-full max-w-2xl mt-20 mb-12">

        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full ${!addMemberMode ? "w-1/2" : "w-full"} bg-gradient-to-r from-purple-500 to-cyan-400`}></div>
          </div>
          <span className="text-xs text-cyan-400">
            Step {!addMemberMode ? "1" : "2"} of 2
          </span>
        </div>

        {/* Card */}
        <section className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-10">

          <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-2">Create New Project</h1>
            <p className="text-gray-400">
              Set up your project and start collaborating.
            </p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* STEP 1 */}
            {!addMemberMode && (
              <>
                <div>
                  <label className="text-xs text-gray-400 uppercase">
                    Project Name
                  </label>
                  <input
                    {...register("ProjectName", { required: true })}
                    className="w-full mt-2 bg-black/20 border border-white/10 rounded-lg px-4 py-3"
                    placeholder="Enter project name"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase">
                    Project Description
                  </label>
                  <textarea
                    {...register("ProjectDetail", { required: true })}
                    rows="3"
                    className="w-full mt-2 bg-black/20 border border-white/10 rounded-lg px-4 py-3"
                    placeholder="Describe your project..."
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase">
                    GitHub Repository
                  </label>
                  <input
                    {...register("RepoName", { required: true })}
                    className="w-full mt-2 bg-black/20 border border-white/10 rounded-lg px-4 py-3"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </>
            )}

            {/* STEP 2 */}
            {addMemberMode && (
              <div className="pt-4 border-t border-white/10">

                {/* Search */}
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search team members..."
                  className="w-full mb-4 bg-black/20 border border-white/10 rounded-lg px-4 py-2"
                />

                {/* User List */}
                <div className="max-h-40 overflow-y-auto space-y-2 mb-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => !isAlreadyAdded(user._id) && setSelectedUser(user)}
                      className={`p-2 border rounded-lg cursor-pointer 
                        ${isAlreadyAdded(user._id)
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:border-cyan-400 border-white/10"
                        }`}
                    >
                      {user.name}
                    </div>
                  ))}
                </div>

                {/* Role Assign */}
                {selectedUser && (
                  <div className="space-y-3 border-t border-white/10 pt-4">
                    <p className="text-sm text-gray-400">
                      Assign role to{" "}
                      <span className="text-cyan-400">
                        {selectedUser.name}
                      </span>
                    </p>

                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Enter role"
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        if (!role) return;

                        setTeam([...team, { ...selectedUser, role }]);
                        setSelectedUser(null);
                        setRole("");
                      }}
                      className="bg-purple-500 px-4 py-2 rounded-lg"
                    >
                      Save Member
                    </button>
                  </div>
                )}

                {/* Added Members */}
                <div className="mt-4 space-y-2">
                  {team.map((m, i) => (
                    <div key={i} className="flex justify-between border p-2 rounded">
                      <span>{m.name} — {m.role}</span>

                      <button
                        type="button"
                        onClick={() =>
                          setTeam(team.filter((_, idx) => idx !== i))
                        }
                        className="text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">

              {!addMemberMode ? (
                <button
                  type="button"
                  onClick={() => setAddMemberMode(true)}
                  className="flex-1 bg-cyan-400 text-black py-3 rounded-lg"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-1 bg-cyan-400 text-black py-3 rounded-lg"
                >
                  Submit
                </button>
              )}

              <button
                type="reset"
                onClick={() => {
                  reset();
                  setTeam([]);
                  setSearch("");
                }}
                className="flex-1 border border-purple-400 text-purple-400 py-3 rounded-lg"
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