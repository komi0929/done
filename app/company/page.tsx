import Link from "next/link";

export default function CompanyPage() {
    return (
        <main className="max-w-4xl mx-auto py-12 px-6 font-mono">
            <Link href="/" className="text-sm text-gray-400 hover:text-black mb-8 inline-block">&larr; BACK TO APP</Link>

            <h1 className="text-4xl font-black mb-8">会社情報 (Company Info)</h1>

            <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
                <table className="w-full border-collapse">
                    <tbody>
                        <tr className="border-b border-gray-200">
                            <th className="py-3 text-left font-bold w-1/3">会社名</th>
                            <td className="py-3">株式会社 DONE (仮)</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <th className="py-3 text-left font-bold">代表者</th>
                            <td className="py-3">代表取締役 [お名前]</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <th className="py-3 text-left font-bold">所在地</th>
                            <td className="py-3">〒XXX-XXXX<br />東京都渋谷区 [住所]</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <th className="py-3 text-left font-bold">設立</th>
                            <td className="py-3">2024年XX月</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <th className="py-3 text-left font-bold">事業内容</th>
                            <td className="py-3">
                                <ul className="list-disc list-inside">
                                    <li>タスク管理アプリケーションの開発・運営</li>
                                    <li>生産性向上ツールの提供</li>
                                </ul>
                            </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                            <th className="py-3 text-left font-bold">お問い合わせ</th>
                            <td className="py-3">info@example.com</td>
                        </tr>
                    </tbody>
                </table>

                <p className="text-gray-400 text-xs mt-12">※ 上記情報はダミーです。正式な情報をご入力ください。</p>
            </div>
        </main>
    );
}
