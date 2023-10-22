import { Client } from './Structures'
;(async (): Promise<void> => {
    const client = new Client()

    await client.start()
})()
