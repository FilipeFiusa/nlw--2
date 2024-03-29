import React from 'react';

import whatsappIcon from '../../assets/images/icons/whatsapp.svg'

import './styles.css'
import api from '../../services/api';

export interface Teacher {
    avatar: string;
    bio: string;
    cost: number
    id: number
    name: string
    subject: string
    whatsapp: string
}

interface TeacherItemProps {
    teacher: Teacher;
}

const TeacherItem: React.FC<TeacherItemProps> = ({ teacher }) =>{
    function createNewConnection(){
        api.post('connections', {
            user_id: teacher.id
        })
    }

    return(
        <article className="teacher-item">
            <header>
                <img src={teacher.avatar} alt={teacher.avatar}/>
                <div>
                    <strong>{teacher.name}</strong>
                    <span>{teacher.subject}</span>
                </div>
            </header>
            <div>
                <p className="primp">{teacher.bio}</p> 
            </div>

            <footer>
                <p>
                    Preço/hora
                    <strong>R$ {teacher.cost}</strong>
                </p>
                <a target="_blank" onClick={createNewConnection} href={` https://wa.me/${teacher.whatsapp}`} type="button">
                    <img src={whatsappIcon} alt="Whatsapp"/>
                    Entrar em Contato
                </a>
            </footer>
        </article>

    )
}

export default TeacherItem;