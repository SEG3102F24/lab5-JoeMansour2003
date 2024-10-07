import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { RouterLink } from '@angular/router';
import { NgFor, AsyncPipe, DatePipe } from '@angular/common';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBy-Htaqt7DGsAr89_YDP8Kbej-QuOgcDM',
  authDomain: 'school-c885c.firebaseapp.com',
  projectId: 'school-c885c',
  storageBucket: 'school-c885c.appspot.com',
  messagingSenderId: '1014947437230',
  appId: '1:1014947437230:web:43329ef5f9b0369805eb3f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  standalone: true,
  imports: [RouterLink, NgFor, AsyncPipe, DatePipe],
})
export class EmployeesComponent implements OnInit {
  protected employees: any[] = [];

  async ngOnInit() {
    const querySnapshot = await getDocs(collection(db, 'employees'));
    this.employees = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      // Ensure dateOfBirth is a Date object
      if (data['dateOfBirth']) {
        data['dateOfBirth'] = data['dateOfBirth'].toDate();
      }
      return data;
    });
  }
}
