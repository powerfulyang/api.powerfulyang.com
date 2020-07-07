import { Logger } from '@nestjs/common';

export class CustomLogger extends Logger {
    log(message: string) {
        // write the message to a file, send it to the database or do anything
        super.log(message);
    }
}
