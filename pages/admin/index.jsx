import { useState, useEffect } from 'react'
import Head from 'next/head'
import cn from 'classnames'
import { REST, GET } from 'libs/fetch'
import useSWR, { mutate } from 'swr'
import { getTime } from 'libs/rus'
import styles from 'styles/main.module.sass'

export default function AdminPage() {

	const [ search, setSearch ] = useState('');
	const [ modal, setModal ] = useState(null);
	const [ modal2, setModal2 ] = useState(null);

	const { data } = useSWR('/api/admin-words', GET, { refreshInterval: 1000 });

	if(!data) return <div></div>

	if(data && data.error === 'wrong password')
		return (<Auth/>);

	let _data = data;
	if(search !== ''){
		const _search = search.toLowerCase();
		_data = data.filter(str => str.word.toLowerCase().startsWith(_search));
	}

	const onDelete = (item, target) => {
		const pos = target.getBoundingClientRect();
		setModal({text: item.word, top: pos.top+window.pageYOffset, _id: item._id});

		document.addEventListener('mousedown', () => setModal(null), {once: true});
	}

	const onConfirm = () => {
		REST('/api/admin-words', {_id: modal._id}, 'DELETE').then(res => {
			if(!res.error)
				mutate('/api/admin-words');
		});
	}

	const deleteAll = () => {
		setModal2({top: 100});
		document.addEventListener('mousedown', () => setModal2(null), {once: true});
	}

	console.log(modal2);

	const onConfirm2 = () => {
		REST('/api/delete-all', {}, 'DELETE').then(res => {
			if(!res.error)
				mutate('/api/admin-words');
		});
	}

	return (
		<div className={styles.main} style={{justifyContent: "flex-start"}}>
			<Head>
				<title>Админ-панель</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<h2>Админ-панель</h2>
			<button className={styles.deleteAll} onClick={deleteAll}>X</button>
			<input className={styles.search} value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..."/>
			<ul className={styles.list}>
				{_data.map(item => (
					<li key={item._id}>
						<button onClick={(e) => onDelete(item, e.currentTarget)}>
							<div className={styles.title}>{item.word}</div>
							<div className={styles.time}>{getTime(item.time)}</div>
						</button>
					</li>
				))}
			</ul>
			{modal && (
				<div className={styles.modal} style={{top: modal.top}}>
					<div className={styles.sub}>
						Удалить данное сообщение?
					</div>
					<div>
						{modal.text}
					</div>
					<div className={styles.buttons}>
						<button>Отмена</button>
						<button onMouseDown={onConfirm}>Удалить</button>
					</div>
				</div>
			)}
			{modal2 && (
				<div className={styles.modal} style={{top: modal2.top}}>
					<div className={styles.sub}>
						Удалить все сообщения?
					</div>
					<div className={styles.buttons}>
						<button>Отмена</button>
						<button onMouseDown={onConfirm2}>Удалить</button>
					</div>
				</div>
			)}
		</div>
	);

}




function Auth (props){

	const [value, setValue] = useState('');

	const onSubmit = (e) => {
		e.preventDefault();
		REST('/api/auth', {password: value}).then(res => {
			if(res.success)
				mutate('/api/admin-words')
		});
	}

	return (
		<form className={styles.main} onSubmit={onSubmit}>
			<Head>
				<title>Вход в админ-панель</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<h1>Админ-панель</h1>
			<div>
				<label htmlFor="input">Введите пароль от админ-панели</label>
				<input id="input" name="word" type="text" autoComplete="off" value={value} onChange={(e) => setValue(e.target.value)}/>
			</div>
			<button className={cn("button", value && styles.active)}>Войти</button>
		</form>
	);
}