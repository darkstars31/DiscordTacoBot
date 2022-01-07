import bunyan from 'bunyan';
import path from 'path';

const __dirname = path.resolve();
const dateString = new Date(Date.now()).toISOString().split('T')[0];

export const log = bunyan.createLogger({
    name: "log",
		streams: [ 
			{
				level: 'debug',
				stream: process.stdout // log INFO and above to stdout
			},
			{ 
				level: 'warn', 
				type: 'rotating-file',
        path: __dirname + `/logs/${dateString}.log`,
        period: '1d',   // daily rotation
        count: 5
			}
		]
});