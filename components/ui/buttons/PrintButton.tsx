"use client";

import { ActionIcon, Tooltip } from "@mantine/core";
import { IconPrinter } from "@tabler/icons-react";

interface PrintButtonProps {
  onClick: () => void;
  size?: "xs" | "sm" | "md" | "lg";
}

export function PrintButton({ onClick, size = "sm" }: PrintButtonProps) {
  return (
    <Tooltip label="Print">
      <ActionIcon variant="subtle" onClick={onClick} size={size}>
        <IconPrinter size="80%" />
      </ActionIcon>
    </Tooltip>
  );
}

export default PrintButton;
