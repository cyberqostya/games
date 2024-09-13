import { useEffect, useRef, useState } from "react";
import "./Player.scss";
import mainStore from "MainStore";

export const Player = () => {
  const [playerName, setPlayerName] = useState(
    `Жертва ${mainStore.playersStore.players.length}`
  );
  function inputHandler(e) {
    setPlayerName(e.target.value);
  }

  const [places, setPlaces] = useState([
    { title: "Логово", has: true, used: false },
    { title: "Джунгли", has: true, used: false },
    { title: "Река", has: true, used: false },
    { title: "Пляж", has: true, used: false },
    { title: "Вездеход", has: true, used: false },
    { title: "Болото", has: false, used: false },
    { title: "Убежище", has: false, used: false },
    { title: "Обломки", has: false, used: false },
    { title: "Источник", has: false, used: false },
    { title: "Артефакт", has: false, used: false },
  ]);
  function placesHandler(title, checkboxType) {
    const copyArray = JSON.parse(JSON.stringify(places));
    const changedObject = copyArray.find(i => i.title === title);
    changedObject[checkboxType] = !changedObject[checkboxType];
    setPlaces(copyArray);
  }

  // Раскрытие
  const invisiblePart = useRef();
  const [isActive, setIsActive] = useState(false);
  const [invisiblePartStyle, setInvisiblePartStyle] = useState({});
  useEffect(() => {
    setInvisiblePartStyle({
      height: invisiblePart.current.scrollHeight,
      paddingTop: 15,
      paddingBottom: 15,
    });
  }, []);

  return (
    <div className='player'>
      <div className='player__visible-part'>
        <input
          type='text'
          className='player__name'
          value={playerName}
          onInput={inputHandler}
        />
        <div className='player__places' onClick={() => { setIsActive(!isActive) }}>
          {places.map((i, key) => (
              <div key={key} className={'player__place-image' + (i.has ? ' _has' : '') + (i.used ? ' _used' : '')}></div>
            ))}
        </div>
      </div>
      <div
        className='player__invisible-part'
        ref={invisiblePart}
        style={isActive ? invisiblePartStyle : {}}
      >
        <div className='player__checkboxes'>
          <p className='player__checkboxes-title'>В инвентаре:</p>
          {places.map((i, key) => (
            <label key={key} className='player__checkboxes-checkbox' >
              <input type='checkbox' checked={i.has} onChange={() => { placesHandler(i.title, 'has') }} />
            </label>
          ))}
        </div>
        <div className='player__checkboxes'>
          <p className='player__checkboxes-title'>Использовал:</p>
          {places.map((i, key) => (
            <label key={key} className='player__checkboxes-checkbox' data-name={i.title} >
              <input type='checkbox' checked={i.used} onChange={() => { placesHandler(i.title, 'used') }} />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
