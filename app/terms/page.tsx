import Link from "next/link";

export default function TermsPage() {
    return (
        <main className="max-w-4xl mx-auto py-12 px-6 font-mono">
            <Link href="/" className="text-sm text-gray-400 hover:text-black mb-8 inline-block">&larr; BACK TO APP</Link>

            <h1 className="text-4xl font-black mb-8">利用規約 (Terms of Service)</h1>

            <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
                <section>
                    <h2 className="text-xl font-bold mb-2">第1条（適用）</h2>
                    <p>
                        本規約は、当社が提供するサービス「DONE!!!」（以下「本サービス」）の利用条件を定めるものです。
                        ユーザーの皆様には、本規約に従って本サービスをご利用いただきます。
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">第2条（利用登録）</h2>
                    <p>
                        登録希望者が当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、
                        利用登録が完了するものとします。
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">第3条（禁止事項）</h2>
                    <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
                    <ul className="list-disc list-inside mt-2">
                        <li>法令または公序良俗に違反する行為</li>
                        <li>犯罪行為に関連する行為</li>
                        <li>当社のサービスの運営を妨害する行為</li>
                        <li>他のユーザーに関する個人情報等を収集・蓄積する行為</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">第4条（免責事項）</h2>
                    <p>
                        当社は、本サービスに起因してユーザーに生じたあらゆる損害について、一切の責任を負いません。
                    </p>
                </section>

                <p className="text-gray-400 text-xs mt-12">最終更新日: 2024年12月25日</p>
            </div>
        </main>
    );
}
