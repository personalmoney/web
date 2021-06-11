import { writeFile } from 'fs';

const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `export const environment = {
   production: true,
   appVersion: require('../../package.json').version,
   supabase: {
    url: '${process.env.APP_URL}',
    key: '${process.env.APP_KEY}'
   }
};
`;

writeFile(targetPath, envConfigFile, 'utf8', (err) => {
  if (err) {
    return console.log(err);
  }
});
