import React, { useState } from 'react';
import Game from './Game';
import './App.css'; // スタイルシートをインポート

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <h1>リネンサービスゲーム</h1>
      </header>
      <main className="App-main">
        {!gameStarted ? (
          <div className="App-start-screen">
            <h2>ゲーム説明</h2>
            <p>リネンを正しい順序でステーション間に移動させてスコアを稼ごう！</p>
            <button onClick={() => setGameStarted(true)}>ゲーム開始</button>
          </div>
        ) : (
          <Game />
        )}
      </main>
      <footer className="App-footer">
        <p>&copy; 2023 リネンサービスゲーム</p>
      </footer>
    </div>
  );
}

export default App;
