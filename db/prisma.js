const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const bcryptjs = require('bcryptjs');
const cloudinary = require('./cloudinary');





//USER

const cleanString = (str) => {
    return typeof str === 'string'
      ? str.replace(/[\x00-\x1F\x7F]/g, '') // Removes control chars
      : str;
  };

const createUser = async(username, name, lastname, password, email, country) => {
    try {
            //check if user exist
    const userExist = await prisma.secretusers.findUnique({
        where:  {username},
    });
    if(userExist) {
        return;
    }
    //create the user
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await prisma.secretusers.create({
        data: {
            username,
            name,
            lastname,
            email,
            password: hashedPassword,
            country
        }
    });
    return user;
        
    } catch (error) {
        console.error(error);
        return error;
    }
}
const getUserById = async(userId) => {
    try {
        const user = await prisma.secretusers.findUnique({
            where: {
                id: userId
            }
        })
        return user;
    } catch (error) {
        console.error(error);
        return error;
    }
}


//FOLDERS
const createFolder = async(folderName, userId) => {
    try {
        //check total limit
        const hasSpace = await foldersTotalLimit();
        if(!hasSpace) {
            console.log('Too much folders on the app.')
            return;
        }

        await prisma.folders.create({
            data: {
                user_id: userId,
                folder_name: folderName
            }
        })
    } catch (error) {
        console.error(error);
        return error;
    }
}

const getFolderById = async(folderId) => {
    try {
        const exist = await prisma.folders.findUnique({
            where: {
                id: folderId
            }
        })
    return exist;
    } catch (error) {
        console.error(error)
    }
}

const getFoldersById = async(userId) => {
    try {
        const folders = await prisma.folders.findMany({
            where: {
                user_id: userId,
            }
        })
        return folders;
    } catch (error) {
        console.error(error);
        return;
    }
}

const deleteFolderById = async(folderId, userId) => {
    try {
        const folder = await getFolderById(folderId);
        //secure
        if(folder.user_id != userId) {
            return;
        }

        //logic to delete all the files in the folders
        const filesFromFolder = await getFilesByFolder(userId, folder.id);

        //loop dans le folder
        if(filesFromFolder.length > 0) {
            await Promise.all(filesFromFolder.map(async (file) => {
                try {
                    await deleteFileById(file.user_id, file.id);
                } catch (error) {
                    console.error(error);
                }
            }))
        }

        // delete folder db
        const deletedFolder = await prisma.folders.delete({
            where: {
                id: folder.id,
            }
        });
        return deletedFolder;

        
    } catch (error) {
        console.error(error);
        return;
    }
}

//FOLDERS - LIMIT

const foldersCheckLimit = async (userId) => {
    const folders = await getFoldersById(userId);
    if(folders.length > 5) {
        return false;
    }
    return true;
}
const foldersTotalLimit = async () => {
    const totalFolders = await prisma.folders.findMany();
    if(totalFolders.length > 20) {
        return false;
    }
    return true;
}



//FILES

//FILES - LIMIT

const filesCheckLimit = async (userId) => {
    const files = await getFilesByUser(userId);
    if(files.length >= 5) {
        return false;
    }
    return true;
}

const filesCheckTotalLimit = async () => {
    const files = await prisma.files.findMany();
    if(files.length > 10) {
        return false;
    }
    return true;
}





const createFile = async(userId, file, folderId, temp) => {
    try {
        if(!userId) {return 'User not found'}

        //check limit
        const hasRight = filesCheckTotalLimit();
        if(!hasRight) {
            console.log('total limit exceeded');
            return;
        }

        const safeName = file.name ? file.name : 'Unnamed File';  
        const safeMd5 = file.md5 ? file.md5 : 'no-md5';            
        const safeMime = file.mimetype ? file.mimetype : 'unknown/mime'; 

        const cloudFile = await cloudinary.uploadImg(temp);
        const url = await cloudinary.getUrl(cloudFile);

        const newFile = await prisma.files.create({
            data: {
                file_name: safeName,
                file_size: file.size, // assuming number
                md5_hash: cleanString(safeMd5),
                folder_id: folderId,
                mime_type: safeMime,
                cloud_url: url,
                cloud_id: cloudFile.public_id,
                user_id: userId, // number
            }
        })


        return newFile;
    } catch (error) {
        console.error(error);
        return error;
    }
}

const getFilesByFolder = async(userId, folderId) => {
    try {
        //check if user is auth
        const folder = await prisma.folders.findUnique({
            where: {
                id: folderId,
            }
        })
        if(folder.user_id != userId) {
            return false;
        }

        //check for files
        const files = await prisma.files.findMany({
            where: {
                folder_id: folderId,
            }
        })

        return files
        
    } catch (error) {
        console.error(error);
        return error;
    }
}

const getFilesFromUser = async(userId) => {
    try {
    const files = await prisma.files.findMany({
        where: {
            user_id: userId,
        }
    })
    console.log(files);
    return files;

    } catch (error) {
      console.error(error);
      return error;  
    }
}

const getFileById = async(id) => {
    try{
    const result = await prisma.files.findUnique({
        where: {
            id
        }
    });
    console.log(result);
    return result;
} catch(err) {
    console.error(err);
    return err;
}
}

const getFilesByUser = async(userId) => {
    try {
        const files = await prisma.files.findMany({
            where: {
                user_id: userId
            }
        })
        return files;
    } catch (error) {
        console.error(error);
    }
}

const deleteFileById = async(userId, fileId) => {
    try {
        //check if authorized
        
        const file = await getFileById(fileId);
        if(file.user_id != userId) {
            return;
        }

        //delete file on cloudinary
        await cloudinary.deleteByFileId(file.cloud_id);

        //delete file on psql
        const deletedFile = await prisma.files.delete({
            where: {
                id: file.id,
            }
        });
        return deletedFile;


    } catch (error) {
        console.error(error);
        return error;
    }
}







module.exports = {
    createUser,
    createFile,
    getFilesFromUser,
    getUserById,
    getFoldersById,
    createFolder,
    getFilesByFolder,
    getFolderById,
    getFileById,
    deleteFileById,
    deleteFolderById,
    foldersCheckLimit,
    foldersTotalLimit,
    getFilesByUser,
    filesCheckLimit
}

