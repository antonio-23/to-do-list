"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit2, Check, X } from "lucide-react";

interface TodoItemProps {
  todo: any;
  onToggle: () => void;
  onDelete: () => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border hover:shadow-sm transition-shadow">
      <Checkbox
        defaultChecked={todo.state !== "active"}
        onCheckedChange={onToggle}
        className="mt-0.5"
      />
      <span
        className={`flex-1 ${
          todo.completed ? "line-through text-muted-foreground" : ""
        }`}
      >
        {todo.name}
      </span>
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            onDelete();
          }}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
