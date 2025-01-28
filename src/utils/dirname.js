import path from 'path';
import { fileURLToPath } from 'url';



const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)
const proyectRoot = path.resolve(_dirname, '../../')

export default proyectRoot;