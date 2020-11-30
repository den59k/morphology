import { useState, useEffect } from 'react'
import Head from 'next/head'
import cn from 'classnames'
import { REST } from 'libs/fetch'

import styles from 'styles/main.module.sass'

function toggleFullScreen() {
  if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen(); 
    }
  }
}

export default function Home() {

	const [ value, setValue ] = useState("");
	const [ state, setState ] = useState({mode: 0});

	const mode = state.mode;
	useEffect(() => {
		if(mode === 2){
			const timeout = setTimeout(() => {
				setState({mode: 0});
			}, 2000);

			return () => clearTimeout(timeout);
		}
	}, [mode]);

	const onSend = (e) => {
		e.preventDefault();

		const word = value.trim();
		
		if(word === 'full-screen'){
			toggleFullScreen();
			return;
		}

		if(word === ''){
			setState({mode: 2, text: "Введите пожелание"});
			return;
		}

		setState({mode: 1});

		REST('/api/words', { word }).then(res => {
			
			if(!res.error){
				setState({mode: 2, text: "Ваш ответ отправлен"});
				setValue("");
			}

			if(res.error)
				setState({mode: 2, text: "Произошла ошибка"});

		});
	}

	return (
		<div >
			<Head>
				<title>Оставьте свое пожелание</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			
			<form className={cn(styles.main, state.mode !== 0 && styles.hidden)} onSubmit={onSend}>
				<h1>Оставьте свое пожелание</h1>
				<div>
					<label htmlFor="input">Введите пожелание, и оно впишется в образ</label>
					<input id="input" name="word" type="text" autoComplete="off" value={value} onChange={(e) => setValue(e.target.value)}/>
				</div>
				<button className={cn("button", styles.button, value && styles.active)}>Отправить</button>
			</form>
			
			<div className={cn(styles.main, state.mode !== 1 && styles.hidden)}>
				<img src="/puff.svg" alt="Загрузка" style={{width: "100px"}}/>
			</div>
			
			<div className={cn(styles.main, state.mode !== 2 && styles.hidden)}>
				<h1>{state.text}</h1>
			</div>
			
		</div>
	)
}
