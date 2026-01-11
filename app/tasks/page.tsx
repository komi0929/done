import SimpleTaskStack from "@/components/SimpleTaskStack";
import Link from "next/link";

export default function TasksPage() {
    return (
        <main className="w-full h-screen bg-gray-100 flex flex-col">
            <header className="p-4 flex justify-between items-center text-xs font-mono">
                <Link href="/" className="hover:underline flex items-center gap-2">
                    <span>← 戻る</span>
                </Link>
                <span className="font-bold text-gray-400">シンプルモード</span>
            </header>
            <div className="flex-1 overflow-hidden">
                <SimpleTaskStack />
            </div>
        </main>
    );
}
