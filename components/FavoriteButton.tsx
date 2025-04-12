"use client";

import { ActionIcon, Tooltip } from "@mantine/core";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { toggleFavoriteAction } from "@/actions/favorites";
import { useState, useEffect } from "react";

interface FavoriteButtonProps {
  devotionalId: number;
  initialFavorited?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function FavoriteButton({
  devotionalId,
  initialFavorited = false,
  size = "md",
}: FavoriteButtonProps) {
  const router = useRouter();
  const { user } = useAuth();
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
        color="blue"
        onClick={handleClick}
        size={size}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorited ? <IconHeartFilled /> : <IconHeart />}
      </ActionIcon>
    </Tooltip>
  );
}
