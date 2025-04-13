"use client";

import { Button, Menu, ActionIcon } from "@mantine/core";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { IconUser } from "@tabler/icons-react";
import { logout } from "@/actions/logout";
import { User } from "@supabase/supabase-js";

export function LoginButton({ user }: { user: User | null }) {
  const router = useRouter();

  const handleLogin = () => {
    const currentPath = window.location.pathname;
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  const handleLogout = async () => {
    await logout();
  };

  if (user) {
    return (
      <Menu position="bottom-end" withArrow>
        <Menu.Target>
          <ActionIcon variant="light" size="lg" radius="xl">
            <IconUser style={{ width: "60%", height: "60%" }} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Signed in as</Menu.Label>
          <Menu.Label>{user.email}</Menu.Label>
          <Menu.Divider />
          <Menu.Item color="red" onClick={handleLogout}>
            Sign out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  }

  return (
    <Button variant="light" size="sm" onClick={handleLogin}>
      Login
    </Button>
  );
}
