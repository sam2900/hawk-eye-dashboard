
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/navbar";
import { isAuthenticated, getCurrentUser } from "../utils/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const cards = [
    {
      title: "Submit New Request",
      description: "Create a new sales promotion request",
      action: "New Request",
      path: "/new-request",
      color: "bg-gradient-to-br from-hawk to-hawk-dark",
      showTo: ["sales_rep"]
    },
    {
      title: "View My Requests",
      description: "Check status of your submitted requests",
      action: "View Requests",
      path: "/my-requests",
      color: "bg-gradient-to-br from-blue-500 to-blue-700",
      showTo: ["sales_rep"]
    },
    {
      title: "Sales Insights",
      description: "View performance metrics and analytics",
      action: "View Insights",
      path: "/insights",
      color: "bg-gradient-to-br from-purple-500 to-purple-700",
      showTo: ["sales_rep", "district_manager"]
    },
    {
      title: "Admin Dashboard",
      description: "View and manage user requests",
      action: "Go to Admin",
      path: "/admin",
      color: "bg-gradient-to-br from-green-500 to-green-700",
      showTo: ["district_manager"]
    }
  ].filter(card => user && card.showTo.includes(user.role));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-hawk-pattern pt-24 pb-12 px-4 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1436076863939-06870fe779c2?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", backgroundRepeat: 'no-repeat',

        }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl font-bold mb-4">
              Welcome
              {user ? `, ${user.name.split(" ")[0]}` : ""}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Access all your sales management tools and insights from this dashboard
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {cards.map((card, index) => (
              <motion.div
                key={index}
                className={`hawk-card overflow-hidden ${card.color} text-white hover:shadow-lg transition-shadow duration-300`}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">{card.title}</h2>
                  <p className="text-white/80 mb-6">{card.description}</p>
                  <a
                    href={card.path}
                    className="inline-flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-sm font-medium transition-colors backdrop-blur-sm"
                  >
                    {card.action}
                    <ArrowRight size={16} className="ml-2" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 hawk-card p-6"
          >
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">New seasonal promotion request</h3>
                    <p className="text-sm text-muted-foreground">Submitted 2 days ago</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-500">
                    Pending
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Summer discount campaign</h3>
                    <p className="text-sm text-muted-foreground">Submitted 1 week ago</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-500">
                    Approved
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Holiday bundle promotion</h3>
                    <p className="text-sm text-muted-foreground">Submitted 2 weeks ago</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-500">
                    Rejected
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
