import { Request, Response } from 'express'
import FaceRecognition from '../services/FaceRecognition'
import { nanoid } from 'nanoid'
import fs from 'fs'
// import db from '../common/db_connection'

class AuthController {
  
  static async register(req: Request, res: Response) {
    // Récupère le nom de l'utilisateur à partir du corps de la requête
    const name = req.body.name;
    console.log(name); // Affiche le nom de l'utilisateur dans la console

    // Récupère l'image de l'utilisateur à partir du corps de la requête
    const image = req.body.photos;

    // Enlève le préfixe "data:image/<type>;" et ne garde que les données en base64
    const data = image.replace(/^data:image\/\w+;base64,/, "");

    // Convertit la chaîne base64 en un Buffer binaire
    const buf = Buffer.from(data, 'base64');

    // Utilise le nom de l'utilisateur pour nommer le fichier image
    const fileName = name;

    // Écrit le Buffer binaire dans un fichier image sur le disque
    fs.writeFile(`./images/${fileName}.jpg`, buf, async function (err: any) {
        // Si une erreur survient lors de l'écriture du fichier, retourne un statut 401 avec le message 'error'
        if (err) return res.status(401).send('error');
        // Si l'écriture est réussie, retourne un statut 200 avec le message 'ok'
        return res.status(200).send('ok');
         
        






















        // const imageInput = `./uploads/${fileName}.jpg`
        // const recognize = new FaceRecognition(imageInput, user)

        // const resultRecognize = await recognize.recognize()
        
        // res.sendStatus(200)
    // return res.send(req.file)
      })
    // }

    // let dbfullname = req.body.fullname;
    // let dbemail = req.body.email;
    // let dbpassword = req.body.password;
    // let sql = `insert into user (full_name, email, password, status_approval, status) values ( '${dbfullname}', '${dbemail}', '${dbpassword}', 0, 1 )`

    // db.query(sql,(err, result) => {
    //       if (err) throw err;
        
    //     if(result.affectedRows == 1){
    //       res.end(JSON.stringify({message: 'success'}));  
    //     }else{
    //     res.end(JSON.stringify({message: 'gagal'}));  
    //     }
        
    //   });     
    // return res.status(200).send('ok')

  }

 static async login(req: Request, res: Response) {
    try {
      // Affiche "run" dans la console, ce qui indique que la méthode a été appelée
      console.log('run');
      
      // Récupère le nom de l'utilisateur et la photo à partir du corps de la requête
      const user = req.body.user;
      const image = req.body.photos;
  
      // Enlève le préfixe "data:image/<type>;" et ne garde que les données en base64
      const data = image.replace(/^data:image\/\w+;base64,/, "");
      
      // Convertit la chaîne base64 en un Buffer binaire
      const buf = Buffer.from(data, 'base64');
      
      // Génère un nom de fichier unique en utilisant le nom de l'utilisateur et une ID unique
      const fileName = user + '-' + nanoid();
  
      // Écrit le Buffer binaire dans un fichier image sur le disque
      fs.writeFile(`./uploads/${fileName}.jpg`, buf, async function (err: any) {
        if (err) {
          // Affiche l'erreur dans la console si une erreur survient lors de l'écriture du fichier
          console.log(err);
          return;
        }
        
        // Chemin d'accès à l'image enregistrée
        const imageInput = `./uploads/${fileName}.jpg`;
        
        // Crée une nouvelle instance de FaceRecognition avec l'image et l'utilisateur
        const recognize = new FaceRecognition(imageInput, user);
  
        // Effectue la reconnaissance faciale
        const resultRecognize = await recognize.recognize().catch(e => res.status(401).send(e.message));
        
        // Envoie le résultat de la reconnaissance faciale en réponse
        return res.send(resultRecognize);
      });
    } catch (error: any) {
      // Envoie un statut 401 avec le message d'erreur en cas d'exception
      return res.status(401).send(error.message);
    }
  }
}

export default AuthController