
本ソースは記事「TauriにC++を組み込んでGUIアプリケーションを作ろう」の全体ソースになります。

# ビルド方法  

以下のツールをご用意ください  
* pnpm
* cmake
* C++20対応のC/C++コンパイラ  
* Rustツールチェイン

インストール後、以下をターミナルで実行ください。  
```sh
pnpm i

# C/C++サイドをビルド
cd ./src-cpp
cmake -B./build_lib && cd ./build_lib
cmake --build

# Tauri(TS+Rust)サイドをビルド(dev起動の場合)
cd ../../
pnpm run tauri dev
```

# 動作確認済み環境  

* Windows 11 (msvc(Visual Studio 2022))
* MacOS Sonoma (clang15)
* Arch Linux (clang18 & libstdc++. 要webkit2gtk)

# 備考  

本ソースのメンテナンス予定はありません。（年明けあたりにアーカイブ化いたします）  
また所々の実装は暫定的であり、最適化やオーバーラン対策等が十分でないかもかれない旨、ご了承いただけますと幸いです。

ライセンスはCC0ですので、fork、コピペ等はご自由に行なっていただければ嬉しいです。  
