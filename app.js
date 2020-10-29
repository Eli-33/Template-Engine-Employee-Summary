const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");
const { assert } = require("console");
const writeFileAsync = util.promisify(fs.writeFile);

const teamMembers = [];

async function promptForUser(){
    return inquirer.prompt([
        {
            type: "list",
            name: "teamMembers",
            message: "Do you Want to add a member to your team?",
            choices: [
              "Engineer",
              "Intern",
              "I don't want to add any more team members",
            ],
          },
    ]);
}
async function managerQuestions() {
     return inquirer.prompt([
        {
            type : "input",
            name : "Mname",
            message : "Manager name :",
            validate : async (input) => {
                if (input == "") {
                    return "Please enter first and last name.";
                }
                return true;
            }
        },
        {
            type: "input",
            name: "id",
            message: "What is the Manager's ID?",
        },  
        {
           type: "input",
           name: "email",
           message: "Enter manager's email:",
        },
        {
           type: "input",
           name: "officeNum",
           message: "Enter office number:", 
        },
       
     ]);
 } 
    
async function EngineerQuestions() {
         return inquirer.prompt([
            {
                type: "input",
                name: "engname",
                message: "Enter employee name:",
                validate: async (input) => {
                    if (input == "") {
                        return "Please enter a name.";
                    }
                    return true;
                }
            },
            {
                type: "input",
                name: "id",
                message: "What is your Engineer's ID?",
            },
            {
                type: "input",
                name: "email",
                message: "Enter their email:",
             
            },
            {
                type: "input",
                name: "github",
                message: "Please enter your github username:",
                validate: async (input) => {
                    if (input == "") {
                        return "Please enter a valid GitHub username";
                    }
                    return true;
                }
            },
         ]);
        } 
async function internQuestions(){
    return inquirer.prompt([
        {
            type: "input",
            name: "interName",
            message: "Enter employee name:",
            validate: async (input) => {
                if (input == "") {
                    return "Please enter a name.";
                }
                return true;
            }
        },
        {
            type: "input",
            name: "id",
            message: "What is your intern's ID?",
        },
        {
            type: "input",
            name: "email",
            message: "Enter their email:",
        },
        {
             type: "input",
             name: "school",
             message: "Intern, enter your school name:",
                validate: async (input) => {
                    if (input == "") {
                        return "Please enter a name.";
                    }
                    return true;
                }
        },

    ]);
} 
    
async function init() {
    try {
        const manager = await managerQuestions();
        // new manager
    const newManager = new Manager(
        manager.Mname,
        manager.id,
        manager.email,
        manager.officeNum,
      );
      teamMembers.push(newManager);
      createNewTeamMember();
    } catch (err) {
      console.log(err);
    }
}
async function createNewTeamMember() {
    const newEmployeeType = await promptForUser();
    switch (newEmployeeType.teamMembers) {
      case "Engineer":
        const newEngineerInfo = await EngineerQuestions();
        const newEngineer = new Engineer(
          newEngineerInfo.engname,
          newEngineerInfo.email,
          newEngineerInfo.id,
          newEngineerInfo.github,
        );
        teamMembers.push(newEngineer);
        createNewTeamMember();
        break;
      case "Intern":
        const newInternInfo = await internQuestions();
        const newIntern = new Intern(
          newInternInfo.interName,
          newInternInfo.id,
          newInternInfo.email,
          newInternInfo.school,
        );
        teamMembers.push(newIntern);
        createNewTeamMember();
        break;
        default:
          // generate HTML and save to the disk
          BuiltHTML(teamMembers);
          console.log("success");
  }
  console.log(teamMembers);
}
  function BuiltHTML(teamMembers) {
        console.log(teamMembers);
        let html = render(teamMembers);
         let checkF = fs.existsSync(OUTPUT_DIR);
         if (!checkF) {       
             checkF = (fs.mkdirSync(OUTPUT_DIR, { recursive: true }) !== "");
         }
 
         if (checkF) {
             writeFileAsync(`${OUTPUT_DIR}/team.html`, html)
                 .then(() => {
                     console.log(`Successfully created team : ${OUTPUT_DIR}/team.html`);
                     process.exit(0);
                 })
                 .catch(() => {
                     console.log(`Unable to save webpage file at : ${OUTPUT_DIR}/team.html`);
                     process.exit(0);
                 });
         } else {
             console.log('Unable to create output.');
         }
     }
 
    
  init();