import { Request, Response } from 'express';

import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHoursToMinites';

interface ScheduleItem {
    week_day: number,
    from: string,
    to: string
}

export default class ClassesController {
    async index(request: Request, response: Response){
        const filters = request.query;

        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;

        if(!subject || !week_day || !time){
            return response.status(400).json({
                error: "Missing Filters to search classes"
            })
        }

        const timeInMinutes = convertHourToMinutes(time);

        const classes = await db('classes')
            .whereExists(function(){
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                    .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                    .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                    .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
            })
            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*'])

        response.json(classes);
    }

    async create(request: Request, response: Response) {
        const {
            name, 
            avatar, 
            whatsapp, 
            bio, 
            subject, 
            cost, 
            schedule
        } = request.body;
    
        const trx = await db.transaction()
    
        try {
            const insertedUsertsIds = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio
            })
        
            const user_id = insertedUsertsIds[0];
        
            const insertedClassesIds = await trx('classes').insert({
                subject, 
                cost,  
                user_id
            })
        
            const class_id = insertedClassesIds[0];
        
        
            const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
                return {
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: convertHourToMinutes(scheduleItem.from),
                    to: convertHourToMinutes(scheduleItem.to)
                }
            })
        
            await trx('class_schedule').insert(classSchedule);
        
        
            await trx.commit();
        
            return response.status(201).json()
        } catch (error) {
    
            await trx.rollback()
    
            //console.log(error)
            return response.status(400).json({
                error:"Unexpected errow while creating new class"
            })
        }
    }
}