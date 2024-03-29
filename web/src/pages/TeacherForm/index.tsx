import React, {useState, FormEvent} from 'react';
import { useHistory } from 'react-router-dom'

import PageHeader from '../../Components/PageHeader';
import Input from '../../Components/Input';
import Textarea from '../../Components/Textarea';
import Select from '../../Components/Select';

import './styles.css';

import warningIcon from '../../assets/images/icons/warning.svg';
import api from '../../services/api';

function TeacherList(){

    const history = useHistory()

    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [bio, setBio] = useState('');
    const [subject, setSubject] = useState('');
    const [cost, setCost] = useState('');

    const [scheduleItems, setScheduleItems] = useState([
        {week_day: 0, from: "" , to: ""},
    ]); 

    
    function addNewScheduleItem(){
        setScheduleItems([
            ...scheduleItems,
            { week_day: 0, from: '', to: ''}
        ]);
    }

    function handleCreateClass(e: FormEvent){
        e.preventDefault();

        api.post('classes', {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost: Number(cost),
            schedule: scheduleItems
        }).then(()=>{
            alert('Cadastro realizado com Sucesso');

            history.push('/');
        }).catch(() => {
            alert('Erro no Cadastro');
        })
    }

    function setScheduleItemValue(position: number, field: string, value: string){
        const updatedScheduleItens = scheduleItems.map((scheduleItem, index) => {
            if(index === position){
                return { ...scheduleItem, [field]: value}
            }

            return scheduleItem;
        })

        setScheduleItems(updatedScheduleItens);
    }

    return (
        <div id="page-teacher-form" className="container">
            <PageHeader 
                title="Que Incrivel que você quer dar Aula" 
                description="O primeiro passo é preencher esse formulário de inscrissão"
            />

            <main>
                <form onSubmit={handleCreateClass}>
                    <fieldset>
                        <legend>Seus dados</legend>

                        <Input 
                            name="name" 
                            label="Nome Completo" 
                            value={name} 
                            onChange={ (e) => {setName(e.target.value)}} 
                        />
                        <Input 
                            name="avatar" 
                            label="Avatar" 
                            value={avatar} 
                            onChange={ (e) => {setAvatar(e.target.value)}}
                        />
                        <Input 
                            name="whatsapp" 
                            label="Whatsapp"
                            value={whatsapp} 
                            onChange={ (e) => {setWhatsapp(e.target.value)}} 
                        />
                        <Textarea 
                            name="bio" 
                            label="Biografia" 
                            value={bio} 
                            onChange={ (e) => {setBio(e.target.value)}}
                        />

                    </fieldset>
                    <fieldset>
                        <legend>Sobre a Aula</legend>

                        <Select 
                            name="subject" 
                            label="Matéria"
                            value={subject} 
                            onChange={ (e) => {setSubject(e.target.value)}} 
                            options={[
                                { value: 'Artes', label: 'Artes'},
                                { value: 'Biologia', label: 'Biologia'},
                                { value: 'Ciências', label: 'Ciências'},
                                { value: 'Educação Fisica', label: 'Educação Fisica'},
                                { value: 'Física', label: 'Física'},
                                { value: 'Geografia', label: 'Geografia'},
                                { value: 'História', label: 'História'},
                                { value: 'Matemática', label: 'Matemática'},
                                { value: 'Português', label: 'Português'},
                                { value: 'Quimica', label: 'Quimica'},
                                { value: 'Inglês', label: 'Inglês'}
                            ]}
                        />
                        <Input 
                            name="cost" 
                            label="Custo da sua hora por Aula"
                            value={cost} 
                            onChange={ (e) => {setCost(e.target.value)}} 
                        />

                    </fieldset>

                    <fieldset>
                        <legend>
                            Horários Disponiveis
                            <button type="button" onClick={addNewScheduleItem}>+ Novo Horario</button>
                        </legend>

                        {scheduleItems.map((scheduleItem, index) => {
                            return (
                                <div key={scheduleItem.week_day} className="schedule-item">
                                    <Select 
                                        name="week_day" 
                                        label="Dia da Semana"
                                        value={scheduleItem.week_day}
                                        onChange={e => setScheduleItemValue(index, 'week_day', e.target.value)} 
                                        options={[
                                            { value: '0', label: 'Domingo'},
                                            { value: '1', label: 'Segunda-feira'},
                                            { value: '2', label: 'Terça-feira'},
                                            { value: '3', label: 'Quarta-feira'},
                                            { value: '4', label: 'Quinta-feira'},
                                            { value: '5', label: 'Sexta-feira'},
                                            { value: '6', label: 'Sabado'},
                                        ]}
                                    />
                                    <Input 
                                        name="from" 
                                        label="Das" 
                                        type="time"
                                        value={scheduleItem.from}
                                        onChange={e => setScheduleItemValue(index, 'from', e.target.value)} 
                                    />
                                    <Input 
                                        name="to" 
                                        label="Até" 
                                        type="time"
                                        value={scheduleItem.to}
                                        onChange={e => setScheduleItemValue(index, 'to', e.target.value)} 
                                    />
                                </div>
                            );
                        })}
                    </fieldset>

                    <footer>
                        <p>
                            <img src={warningIcon} alt="Aviso Importante"/>
                            Importante! <br/>
                            Preencha todos os dados
                        </p>

                        <button type="submit">
                            Salvar Cadastro
                        </button>
                    </footer>
                </form>
            </main>

        </div>
    )
}

export default TeacherList;