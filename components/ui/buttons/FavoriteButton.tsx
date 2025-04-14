"use client";

import { ActionIcon, Tooltip } from "@mantine/core";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { toggleFavoriteAction } from "@/actions/favorites";
import { useState } from "react";
import { User } from "@supabase/supabase-js";

interface FavoriteButtonProps {
  devotionalId: number;
  initialFavorited?: boolean;
  size?: "sm" | "md" | "lg";
  user: User | null;
}

export default function FavoriteButton({
  devotionalId,
  initialFavorited = false,
  size = "md",
  user,
}: FavoriteButtonProps) {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);

  const handleClick = async () => {
    console.log("Current user:", user);
    if (!user) {
      // Save the current URL to redirect back after login
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    const newFavorited = await toggleFavoriteAction(devotionalId);
    setIsFavorited(newFavorited);
  };

  return (
    <Tooltip label={isFavorited ? "Remove from favorites" : "Add to favorites"}>
      <ActionIcon
        variant="subtle"
        onClick={handleClick}
        size={size}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorited ? (
          <IconHeartFilled color="red" size="80%" />
        ) : (
          <IconHeart size="80%" />
        )}
      </ActionIcon>
    </Tooltip>
  );
}
