import axios from 'axios';
import { load } from 'cheerio';
import { Router } from 'express';
import { Plugin } from '../types/index';

const pinterest = async (term: string): Promise<string[] | { error: string }> => {
    try {
        const { data } = await axios.get(`https://id.pinterest.com/search/pins/?autologin=true&q=${term}`, {
            headers: {
                cookie: '_auth=1; _b="AXtkZcxSOQ9IHJUElcxVXGs1o1+OiC7SaYJCt0IRKOq9iXMB1u4b569MWf1FCuov2QU="; _pinterest_sess=TWc9PSYzU014cG83Y3F1cUV0dHpxalY3QUk2bUU3VEphV3RaWStKZ29RS1ZBK2NRbi92a3hmVUh2bHQ0RUlsdG9JMGtqaDc3bS95SWlyQlZvSUlwUUdmMzZETHFmUURuMHhkWno3NUY0ZDVFYWgyOWt0eVB0VklxZ0dYMnpaUTNONEZJRC8wTzNiRmJNZGw3ajRxV0Q5eXpYc3FGSS9FT1NpM0NzVU9jd0V5cFJBZzVGeUJ1Q3NuTDNKK1FLS0hNcG0vOGpjR2l4bTduZDlnK1BOUUZoV0RhUUo2Qi82QzZTUy9kWXBtcXN3RW9LRU9mU3Vaa3grdGRzMWhqMnJYVnFiaGxCZDVDaElYRVBqcWNEL0lHRXk4eEh2OXJCeUZsdklnUDNjU1B4aHFCN2loeGVCZW5RTGtWRTJXL29ZRU83Y0Z5VTFkOWVOWmo2cmZteVg5NUx6NWpYdllpL0RWZWFKT08xNmJVQllRRC9keFFyeHBkNHRxeDNYMUNJMXlKVWdMRzArUC9zUVhURSt5OTAycXFWWUdwZmJRaStoQzBFVFJSbWk4aWR3OEF4ZmZHcmI0N3hUWmhMWjBpdjQ1OUlSazZ0NEo5VVVwNVdteTNaSUYrcGRGa3V5TnNtKzRoRmNaemYvVHFyTStDeGM4Nksyck5KNHhCY3RObWE4TWkwM09RMUNaYk9oRDJ3QUJJYjAxcTY2L1FWK3BGdldsbHVsZURFZ1pPVE4xZldUS0FmSzhWbGRIdWxhaU02aysvVWZrOTZpRWpEMFRBcDZOUUZ1dGYydDV0Ny93c2xTanpManEvazdlVHhQRXFjNy84Q1ZZZ1lPb1h1RncwOHVOR0tZVXg2bXVhdjNQTVc2a1RJd0trbWhXdlg3RkVwclhVbDBHRGVlSTZyNUh6elFKVDJFSUJxNGM1bElMcHhVaDdXakpDcm13Z1h0WGNTQ3VKc3dic0xEMEhiZjNXM3NhdXd1VWd0QnJHalVHM1F5NElPbTIxTnE3cHV2emRBbFdLak1SK1ZuK0FoMFVqZjdGRnFNQXdhYzlrNmlNcEF4Z0l5eHAxNGF6UHhTMnNYNk1UcjlUUW51QndKUWpBMDdQTzZRRVV2dDgvVGovcnU1K3VhSTU5Mmc0OHRLdmpJNmJtaCtaZmlDZUN1bXdmMGFQcVBacGNBdmQ3ZGl2Q2xFWGVLVTNENTZPOU52Vzg3WE90bHhNN0tjcnJlRDlCaWVxOS9ueDZWcjljc0VLTWdwaTBDdDVJWjdTellUc3lRUUp2ZDNTK0doM29Ja09ja0RPNmRHZ3JRMlUwcEFLVEptazVYZzRoTTZNUGFMcDFJbUxzaUF3L2g0UVN5ZG1ZOTZGN3drWkI0d0NTMVY0a0ZhQVcrbWlCQUZkVHRaSmkybyt3Z3dicVgyTndEM3ZHSFo2Zmcyb3dVZlVySnpuTTdERkw3cHlHQ3FZY0JqclZkZWN3dnpXNkZ6UkJ0ek81L1pCblJuM21GZzh2eFJMOWowUUFpVWV1d2J1cWp3TE9HTHhlcEVScnF6WkxRU2hYSGw5MEx4eVlWQ1hORlZ5WXE5TmpiVnJya2NjRy9pT3ltVDVjYlp6N053UHJXUUZRVHdDUXFxMkNiMTgxVTMzSmFpZ2ZoUVp6b3d5V29Hd1R5STd3bjU0cktPcGc0NkswQ1FCVW93Z205RzVHUGNZcHlUa0daNit4QjI2TmxqeHZFOGpyTFNzVGdTZlRsVi9WcFpneWp0U0Ywck94eFhiWjUrWGdpZ1NwQVVnZ2lzTE1iZlYwUWJqdmomUFRScnRvSEZsYjU5eFpzYmtwRU5hOHZZZG9VPQ=; _ir=0',
            },
        });

        const $ = load(data);
        const pinterestImages = $('div > a')
            .map((_, element) => $(element).find('img').attr('src')?.replace(/236/g, '736'))
            .get()
            .filter((src): src is string => src !== undefined);

        return pinterestImages;
    } catch (err) {
        console.error(err); // Log the error for debugging
        return { error: 'Something went wrong!' };
    }
};

export default (): Plugin => {
    return {
        name: 'PINTEREST',
        description: 'API for searching images on Pinterest',
        parameter: 'query=(Search term)',
        route: '/api/pinterest?query=cat',
        run: (router: Router) => {
            router.get('/pinterest', async (req, res) => {
                const query = req.query.query as string;
                if (!query)
                    return res.status(400).json({
                        error: 'No query was provided in your request',
                    });

                const data = await pinterest(query);
                res.status(200).setHeader('Content-Type', 'application/json').json(data);
                if ('error' in data) return res.status(404).json(data);
            });
        },
    };
};
