import { query } from "@/lib/db";
import CatsList from "@/components/CatsList";

interface Cat {
  id: number;
  name: string;
  age: number | null;
  created_at: string;
}

export default async function Home() {
  let cats: Cat[] = [];
  let error: string | null = null;

  try {
    const result = await query(
      "SELECT id, name, age, created_at FROM cats ORDER BY created_at DESC",
    );
    cats = result.rows as Cat[];
  } catch (err) {
    console.error("Failed to fetch cats:", err);
    error = "Failed to connect to database. Make sure it is running.";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900 py-12 px-4">
      <main className="max-w-2xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
            🐱 Cats Database
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            A simple example app with Next.js and PostgreSQL
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400">{error}</p>
            <p className="text-sm text-red-600 dark:text-red-500 mt-2">
              Make sure PostgreSQL is running:{" "}
              <code className="bg-red-100 dark:bg-red-800/50 px-2 py-1 rounded">
                npm run db:up
              </code>
            </p>
          </div>
        )}

        <div className="grid gap-8">
          {/* Create Cat Form */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              Add a New Cat
            </h2>
            <CatsList />
          </div>

          {/* Cats List */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              All Cats ({cats.length})
            </h2>
            {cats.length === 0 ? (
              <p className="text-zinc-600 dark:text-zinc-400">
                No cats yet. Add one using the form above!
              </p>
            ) : (
              <div className="grid gap-4">
                {cats.map((cat) => (
                  <div
                    key={cat.id}
                    className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-black dark:text-white">
                          {cat.name}
                        </h3>
                        {cat.age && (
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                            Age: {cat.age} year{cat.age !== 1 ? "s" : ""}
                          </p>
                        )}
                        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                          Created:{" "}
                          {new Date(cat.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-2xl">🐱</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
