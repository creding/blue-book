"use client";

import { ActionIcon, Tooltip } from "@mantine/core";
import { IconShare } from "@tabler/icons-react";

interface ShareButtonProps {
  onClick: () => void;
  size?: "xs" | "sm" | "md" | "lg";
}

export function ShareButton({ onClick, size = "sm" }: ShareButtonProps) {
  return (
    <Tooltip label="Share">
      <ActionIcon variant="subtle" onClick={onClick} size={size}>
        <IconShare size="80%" />
      </ActionIcon>
    </Tooltip>
  );
}

export default ShareButton;
