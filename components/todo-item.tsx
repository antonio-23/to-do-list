"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Edit2, Check, X } from "lucide-react"
import type { Todo } from "@/lib/todos"

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, title: string) => void
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, editTitle.trim())
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditTitle(todo.title)
    setIsEditing(false)
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border hover:shadow-sm transition-shadow">
      <Checkbox checked={todo.completed} onCheckedChange={() => onToggle(todo.id)} className="mt-0.5" />

      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave()
              if (e.key === "Escape") handleCancel()
            }}
            className="flex-1"
            autoFocus
          />
          <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8">
            <Check className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleCancel} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <span className={`flex-1 ${todo.completed ? "line-through text-muted-foreground" : ""}`}>{todo.title}</span>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)} className="h-8 w-8">
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(todo.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
