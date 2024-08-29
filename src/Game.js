import React, { useState, useEffect } from 'react';

const LinenItem = ({ onDragStart, status }) => {
  const getColor = () => {
    switch(status) {
      case 'new': return 'dodgerblue';
      case '洗濯・脱水': return 'lightblue';
      case '乾燥': return 'orange';
      case '仕上げ': return 'lightgreen';
      default: return 'dodgerblue';
    }
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      style={{
        backgroundColor: getColor(),
        color: 'white',
        padding: '5px',
        borderRadius: '50%',
        cursor: 'move',
        margin: '2px',
        width: '30px',
        height: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '10px',
      }}
    >
      リネン
    </div>
  );
};

const Station = ({ type, color, onDrop, processing, linens, onDragStart }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={(e) => onDrop(e, type)}
      style={{
        width: '150px',
        height: '150px',
        backgroundColor: color,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '10px',
        position: 'relative',
        border: '2px solid #333',
        borderRadius: '5px',
      }}
    >
      <div style={{ position: 'absolute', top: '5px', left: '5px', right: '5px', textAlign: 'center', fontWeight: 'bold' }}>
        {type}
      </div>
      {processing && <div style={{ position: 'absolute', bottom: '5px', left: '5px', right: '5px', textAlign: 'center' }}>処理中...</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        {linens.map((linen) => (
          <LinenItem key={linen.id} status={type} onDragStart={(e) => onDragStart(e, linen.id, type)} />
        ))}
      </div>
    </div>
  );
};

const TruckSVG = ({ color }) => (
  <svg width="100" height="60" viewBox="0 0 100 60">
    <rect x="10" y="20" width="80" height="30" fill={color} />
    <rect x="70" y="10" width="20" height="20" fill={color} />
    <circle cx="25" cy="50" r="10" fill="black" />
    <circle cx="75" cy="50" r="10" fill="black" />
  </svg>
);

const Game = () => {
  const [linens, setLinens] = useState([]);
  const [stationLinens, setStationLinens] = useState({
    '洗濯・脱水': [],
    '乾燥': [],
    '仕上げ': []
  });
  const [score, setScore] = useState(0);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setLinens((prev) => [...prev, { id: Date.now(), status: 'new' }]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDragStart = (e, id, fromStation) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id, fromStation }));
  };

  const handleDrop = (e, toStation) => {
    e.preventDefault();
    const { id, fromStation } = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    const canMove = (from, to) => {
      if (from === 'new' && to === '洗濯・脱水') return true;
      if (from === '洗濯・脱水' && to === '乾燥') return true;
      if (from === '乾燥' && to === '仕上げ') return true;
      return false;
    };

    if (canMove(fromStation, toStation)) {
      setProcessing((prev) => ({ ...prev, [toStation]: true }));

      if (fromStation === 'new') {
        setLinens(prev => prev.filter(l => l.id.toString() !== id.toString()));
      } else {
        setStationLinens(prev => ({
          ...prev,
          [fromStation]: prev[fromStation].filter(l => l.id.toString() !== id.toString())
        }));
      }

      setStationLinens(prev => ({
        ...prev,
        [toStation]: [...prev[toStation], { id, status: toStation }]
      }));

      setTimeout(() => {
        setProcessing((prev) => ({ ...prev, [toStation]: false }));
        if (toStation === '仕上げ') {
          setScore((prev) => prev + 1);
          setStationLinens(prev => ({
            ...prev,
            '仕上げ': prev['仕上げ'].filter(l => l.id.toString() !== id.toString())
          }));
        }
      }, 2000);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h1>リネンサービスゲーム</h1>
      <div style={{ marginBottom: '20px', fontSize: '20px' }}>スコア: {score}</div>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Station type="洗濯・脱水" color="lightblue" onDrop={handleDrop} processing={processing['洗濯・脱水']} linens={stationLinens['洗濯・脱水']} onDragStart={handleDragStart} />
          <Station type="仕上げ" color="lightgreen" onDrop={handleDrop} processing={processing['仕上げ']} linens={stationLinens['仕上げ']} onDragStart={handleDragStart} />
        </div>
        <Station type="乾燥" color="orange" onDrop={handleDrop} processing={processing['乾燥']} linens={stationLinens['乾燥']} onDragStart={handleDragStart} />
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px' }}>
          <TruckSVG color="green" />
          <TruckSVG color="red" />
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
        {linens.map((linen) => (
          <LinenItem key={linen.id} status={linen.status} onDragStart={(e) => handleDragStart(e, linen.id, 'new')} />
        ))}
      </div>
    </div>
  );
};

export default Game;