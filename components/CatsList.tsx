"use client";

import { useState } from "react";

export default function CatsList() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/cats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          age: age ? parseInt(age, 10) : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create cat:", errorData.error);
      } else {
        console.log("Cat created successfully");
        // Clear form
        setName("");
        setAge("");
        // Refresh the page to show the new cat
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating cat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          Cat Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Whiskers"
          required
          disabled={isLoading}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-black dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label
          htmlFor="age"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          Age (years)
        </label>
        <input
          id="age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="e.g., 3"
          min="0"
          disabled={isLoading}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-black dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !name.trim()}
        className="w-full px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
      >
        {isLoading ? "Adding Cat..." : "Add Cat"}
      </button>
    </form>
  );
}
