import { serve } from "https://deno.land/std@0.116.0/http/server.ts";
import staticFiles from "https://deno.land/x/static_files@1.1.6/mod.ts";
import { format } from "https://deno.land/std/datetime/mod.ts";

function log_request(req: Request, conn: ConnInfo) {
	try {
console.log(req);
		let date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
		let region = Deno.env.get('DENO_REGION');
		let client_ip = conn.remoteAddr.hostname;
		let user_agent = req.headers.get('user-agent');
		let url = req.url;

		if (region === undefined) {
			region = '';
		}

		if (region === null) {
			user_agent = '';
		}

		const record = {
			Date: date,
			Region: region,
			ClientIp: client_ip,
			Url: url,
			UserAgent: user_agent
		};

		// console.log(record);
		console.log(`"${date}", "${region}", "${client_ip}", "${url}, "${user_agent}"`);
	}
	catch (error) {
		console.error('Error: ', error.message);
	}
}

function serveFiles(req: Request, conn: ConnInfo) {
	log_request(req, conn);

	return staticFiles('.')({ 
		request: req, 
		respondWith: (r: Response) => r 
	})
}

serve((req, conn) => serveFiles(req, conn), { addr: ':9000' });
