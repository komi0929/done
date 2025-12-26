import Link from "next/link";

export default function PrivacyPage() {
    return (
        <main className="max-w-4xl mx-auto py-12 px-6 font-mono">
            <Link href="/" className="text-sm text-gray-400 hover:text-black mb-8 inline-block">&larr; BACK TO APP</Link>

            <h1 className="text-4xl font-black mb-8">プライバシーポリシー (Privacy Policy)</h1>

            <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
                <section>
                    <h2 className="text-xl font-bold mb-2">1. 収集する情報</h2>
                    <p>
                        当社は、本サービスの提供にあたり、以下の情報を収集することがあります。
                    </p>
                    <ul className="list-disc list-inside mt-2">
                        <li>メールアドレス（ログイン用）</li>
                        <li>タスク名・プロジェクト名などの入力データ</li>
                        <li>利用時間・アクセスログ</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">2. 情報の利用目的</h2>
                    <p>収集した情報は、以下の目的で利用します。</p>
                    <ul className="list-disc list-inside mt-2">
                        <li>サービスの提供・運営</li>
                        <li>ユーザーサポート</li>
                        <li>サービス改善のための分析</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">3. 第三者提供</h2>
                    <p>
                        当社は、法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供しません。
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">4. Cookie・LocalStorage</h2>
                    <p>
                        本サービスでは、ユーザー体験向上のため、CookieおよびLocalStorageを使用します。
                        これらには個人を特定する情報は含まれませんが、ブラウザ設定で無効化可能です。
                    </p>
                </section>

                <p className="text-gray-400 text-xs mt-12">最終更新日: 2024年12月25日</p>
            </div>
        </main>
    );
}
