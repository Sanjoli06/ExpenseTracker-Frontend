import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const authPaths = ["/", "/login", "/signup", "/forgot-password"];
  if (authPaths.includes(location.pathname)) return null;

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const toggleMobileDrawer = () => setMobileOpen(!mobileOpen);

  const handleMenuClick = (option) => {
    handleMenuClose();
    if (option === "logout") {
      localStorage.removeItem("token");
      navigate("/login");
    } else if (option === "profile") {
      navigate("/profile");
    } else if (option === "forgot") {
      navigate("/forgot-password");
    }
  };

  const links = [
    { name: "Home", path: "/home" },
    { name: "Summary", path: "/summary" },
    { name: "Stats", path: "/stats" },
  ];

  const drawerVariants = {
    hidden: { x: -250 },
    visible: {
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      x: -250,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: i * 0.1,
        ease: "easeOut",
      },
    }),
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: `linear-gradient(to right, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          borderBottom: `1px solid rgba(0,0,0,0.1)`,
        }}
        elevation={0}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Mobile Menu Icon */}
          <IconButton
            color="primary"
            edge="start"
            sx={{ mr: 1, display: { sm: "none" } }}
            onClick={toggleMobileDrawer}
          >
            <motion.div whileTap={{ scale: 0.9 }}>
              <MenuIcon />
            </motion.div>
          </IconButton>

          {/* Logo + Name */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                mr: { sm: 4 },
              }}
              onClick={() => navigate("/home")}
            >
              {/* Inline SVG Logo */}
              <Box
                component="svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                sx={{
                  width: { xs: 28, sm: 36 },
                  height: { xs: 28, sm: 36 },
                  mr: 1.2,
                  fill: "url(#logoGradient)",
                }}
              >
                <defs>
                  <linearGradient
                    id="logoGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "#1976d2", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#42a5f5", stopOpacity: 1 }}
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M21 7H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 
                  2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 
                  10H5V9h16v8zm-4-3c-.55 0-1 .45-1 
                  1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"
                />
              </Box>

              {/* Website Name */}
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.6rem" },
                  background: `linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ExpenseVault
              </Typography>
            </Box>
          </motion.div>

          {/* Desktop Links */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
              <AnimatePresence>
                {links.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial="hidden"
                    animate="visible"
                    variants={linkVariants}
                    custom={i}
                    exit="hidden"
                  >
                    <Button
                      color="primary"
                      onClick={() => navigate(link.path)}
                      sx={{
                        position: "relative",
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        fontWeight: 500,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.1)",
                          transform: "translateY(-1px)",
                        },
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "100%",
                          height: location.pathname === link.path ? "2px" : "0",
                          backgroundColor: "#1976d2",
                          transition: "height 0.3s ease",
                          borderRadius: "0 0 2px 2px",
                        },
                        ...(location.pathname === link.path && {
                          backgroundColor: "rgba(25, 118, 210, 0.15)",
                          "&::after": { height: "2px" },
                        }),
                      }}
                    >
                      {link.name}
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>
          )}

          {/* Profile Icon */}
          <IconButton
            size="large"
            edge="end"
            color="primary"
            onClick={handleProfileMenuOpen}
            sx={{
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.1)",
              },
            }}
          >
            <motion.div whileTap={{ scale: 0.9 }}>
              <AccountCircle />
            </motion.div>
          </IconButton>

          {/* Profile Dropdown */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: 2,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                minWidth: 200,
                backgroundColor: "#ffffff",
              },
            }}
          >
            <AnimatePresence>
              {Boolean(anchorEl) && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <MenuItem
                    onClick={() => handleMenuClick("forgot")}
                    sx={{
                      py: 1.5,
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.1)",
                      },
                    }}
                  >
                    Forgot Password
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuClick("profile")}
                    sx={{
                      py: 1.5,
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.1)",
                      },
                    }}
                  >
                    View Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuClick("logout")}
                    sx={{
                      py: 1.5,
                      color: "#d32f2f",
                      "&:hover": {
                        backgroundColor: "rgba(211, 47, 47, 0.1)",
                      },
                    }}
                  >
                    Logout
                  </MenuItem>
                </motion.div>
              )}
            </AnimatePresence>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <Drawer
            anchor="left"
            open={mobileOpen}
            onClose={toggleMobileDrawer}
            ModalProps={{
              keepMounted: true,
            }}
            PaperProps={{
              sx: {
                background: `linear-gradient(to right, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)`,
                color: "#1976d2",
              },
            }}
          >
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onKeyDown={toggleMobileDrawer}
              >
                {/* Drawer Header with Logo + Name */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      px: 2,
                      py: 2,
                      cursor: "pointer",
                      borderRadius: 2,
                      fontWeight: 500,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.1)",
                        transform: "translateY(-1px)",
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: location.pathname === "/home" ? "2px" : "0",
                        backgroundColor: "#1976d2",
                        transition: "height 0.3s ease",
                        borderRadius: "0 0 2px 2px",
                      },
                      ...(location.pathname === "/home" && {
                        backgroundColor: "rgba(25, 118, 210, 0.15)",
                        "&::after": { height: "2px" },
                      }),
                      position: "relative",
                    }}
                    onClick={() => {
                      navigate("/home");
                      toggleMobileDrawer();
                    }}
                  >
                    <Box
                      component="svg"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      sx={{
                        width: 28,
                        height: 28,
                        mr: 1.2,
                        fill: "url(#logoGradient)",
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="logoGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            style={{ stopColor: "#1976d2", stopOpacity: 1 }}
                          />
                          <stop
                            offset="100%"
                            style={{ stopColor: "#42a5f5", stopOpacity: 1 }}
                          />
                        </linearGradient>
                      </defs>
                      <path
                        d="M21 7H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 
                        2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 
                        10H5V9h16v8zm-4-3c-.55 0-1 .45-1 
                        1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        background: `linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      ExpenseVault
                    </Typography>
                  </Box>
                </motion.div>

                {/* Drawer Links */}
                <List sx={{ py: 1 }}>
                  {links.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -100 }} // start slightly more off left
                      animate={{ opacity: 1, x: 0 }} // slide in to position
                      transition={{
                        duration: 0.8, // increased duration for smoothness
                        delay: 0.1 * i, // small stagger for sequential entry
                        ease: "easeOut",
                      }}
                    >
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => {
                            navigate(link.path);
                            toggleMobileDrawer();
                          }}
                          sx={{
                            position: "relative",
                            px: 2,
                            py: 1.2,
                            borderRadius: 2,
                            fontWeight: 500,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              backgroundColor: "rgba(25, 118, 210, 0.1)", // same as desktop hover
                              transform: "translateX(2px)",
                            },
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              width: "100%",
                              height:
                                location.pathname === link.path ? "2px" : "0",
                              backgroundColor: "#1976d2",
                              transition: "height 0.3s ease",
                              borderRadius: "0 0 2px 2px",
                            },
                            ...(location.pathname === link.path && {
                              backgroundColor: "rgba(25, 118, 210, 0.15)",
                              "&::after": { height: "2px" },
                              fontWeight: 600,
                            }),
                          }}
                        >
                          <ListItemText
                            primary={link.name}
                            primaryTypographyProps={{
                              fontWeight:
                                location.pathname === link.path ? 600 : 500,
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </Box>
            </motion.div>
          </Drawer>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
