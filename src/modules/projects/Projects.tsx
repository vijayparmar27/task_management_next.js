"use client";

import { useState } from "react";
import { Search, Plus, Users } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Projects() {
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen w-full bg-background p-6 transition-colors">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-foreground">Boards</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm text-muted-foreground">Sort by</label>
            <Select defaultValue="recent">
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Choose sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most recently active</SelectItem>
                <SelectItem value="created">Date created</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Filter by</label>
            <Select>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Choose a collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Collections</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="work">Work</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Search</label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Search boards"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="group relative flex h-48 cursor-pointer flex-col items-center justify-center space-y-4 rounded-lg border border-dashed border-border bg-muted/50 p-6 text-center hover:bg-muted">
            <div className="rounded-full border border-border bg-background p-3">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-muted-foreground">
              Create new board
            </h3>
          </Card>

          <Card className="group relative flex h-48 cursor-pointer flex-col justify-between rounded-lg bg-pink-600 p-6 text-white hover:bg-pink-700">
            <h3 className="text-lg font-semibold">vijay</h3>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-sm">Personal</span>
            </div>
          </Card>
        </div>

        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
