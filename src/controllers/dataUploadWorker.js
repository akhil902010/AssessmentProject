
import { workerData, parentPort } from 'worker_threads'
import xlsx from 'xlsx';
import fs from 'fs';
import mongoose from 'mongoose';
import { Agent } from '../models/agent.models.js';
import { User } from '../models/user.models.js';
import { Account } from '../models/account.models.js';
import { Policy } from '../models/policy.models.js';
import { Carrier } from '../models/carrier.models.js';
import { LOB } from '../models/lob.models.js';
import connectionDB from "../db/index.js";
connectionDB();
async function processFile(filePath) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    const data = sheetNames.reduce((acc, sheetName) => {
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      acc[sheetName] = sheetData;
      return acc;
    }, {});

    if (data && data.Sheet1.length) {
      for (let ele of data.Sheet1) {
        //Insert In Agent Table
        let agentObj = {};
        agentObj.name = ele.agent;
        const agentData = await Agent.findOneAndUpdate({
          name: ele.agent
        }, agentObj, {
          upsert: true,
          new: true
        }).exec().catch(function (e) {
          console.log("Error in Agent", e);
        });

        //Users
        let userObj = {};
        userObj.name = ele.firstname;
        userObj.dob = ele.dob;
        userObj.address = ele.address;
        userObj.phoneNumber = ele.phone;
        userObj.state = ele.state;
        userObj.zipCode = ele.state;
        userObj.email = ele.email;
        userObj.gender = ele.gender;
        userObj.userType = ele.dob;
        const userData = await User.findOneAndUpdate({
          email: ele.email
        }, userObj, {
          upsert: true,
          new: true
        }).exec().catch(function (e) {
          console.log("Error in User", e);
        });

        //Insert In User's Account Table
        let accountobj = {};
        accountobj.accountName = ele.account_name;
        if(userData && userData._id){
          accountobj.userId = userData._id;
        }
        
        const accountData = await Account.findOneAndUpdate({
          accountName: ele.account_name
        }, accountobj, {
          upsert: true,
          new: true
        }).exec().catch(function (e) {
          console.log("Error in Account", e);
        });

        //Insert In Policy Category Table
        let policyCategoryObj = {};
        policyCategoryObj.categoryName = ele.category_name;
        const policyCategoryData = await LOB.findOneAndUpdate({
          categoryName: ele.category_name
        }, policyCategoryObj, {
          upsert: true,
          new: true
        }).exec().catch(function (e) {
          console.log("Error in Policy Category", e);
        });

        //Insert In Carrier Table
        let carrierObj = {};
        carrierObj.companyName = ele.company_name;
        const carrierData = await Carrier.findOneAndUpdate({
          companyName: ele.company_name
        }, carrierObj, {
          upsert: true,
          new: true
        }).exec().catch(function (e) {
          console.log("Error in Carrier", e);
        });


        //Insert In Policy Info
        let policyInfoObj = {};
        policyInfoObj.policyNumber = ele.policy_number;
        policyInfoObj.policyStartDate = ele.policy_start_date;
        policyInfoObj.policyEndDate = ele.policy_start_date;
        if(policyCategoryData && policyCategoryData._id){
          policyInfoObj.policyCategoryCollectionId = policyCategoryData._id;
        }
        if(carrierData && carrierData._id){
          policyInfoObj.companyCollectionId = carrierData._id
        }
        if(userData && userData._id){
          policyInfoObj.userId = userData._id;
        }
        const policyInfoData = await Policy.findOneAndUpdate({
          policyNumber: ele.policy_number
        }, policyInfoObj, {
          upsert: true,
          new: true
        }).exec().catch(function (e) {
          console.log("Error in Policy Info", e);
        });

      }

    }
    fs.unlinkSync(filePath);  // Remove the file after processing
    parentPort.postMessage({ status: 'success' });
  } catch (error) {
    parentPort.postMessage({ status: 'error', error: error.message });
  }
}

processFile(workerData.filePath);
