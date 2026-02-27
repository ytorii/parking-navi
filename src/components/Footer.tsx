export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-8 bg-stone-800 px-6 py-8 text-center">
      <p className="text-sm font-bold text-stone-200">キャンプ&グランピングナビ</p>
      <p className="mt-1 text-xs text-stone-400">
        全国のキャンプ場・グランピング施設の空き情報をリアルタイムで共有
      </p>
      <p className="mt-4 text-xs text-stone-500">
        &copy; {year} Camp &amp; Glamping Navi. All rights reserved.
      </p>
    </footer>
  );
}
