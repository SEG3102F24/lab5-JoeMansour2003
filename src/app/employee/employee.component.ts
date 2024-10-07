import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { EmployeeService } from "../service/employee.service";
import { Router, RouterLink } from "@angular/router";
import { Employee } from "../model/employee";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBy-Htaqt7DGsAr89_YDP8Kbej-QuOgcDM",
    authDomain: "school-c885c.firebaseapp.com",
    projectId: "school-c885c",
    storageBucket: "school-c885c.appspot.com",
    messagingSenderId: "1014947437230",
    appId: "1:1014947437230:web:43329ef5f9b0369805eb3f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

@Component({
        selector: 'app-employee',
        templateUrl: './employee.component.html',
        styleUrls: ['./employee.component.css'],
        standalone: true,
        imports: [RouterLink, ReactiveFormsModule]
})
export class EmployeeComponent {
    private builder: FormBuilder = inject(FormBuilder);
    private employeeService: EmployeeService = inject(EmployeeService);
    private router: Router = inject(Router);
    employeeForm = this.builder.group({
        name: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        city: ['', Validators.required],
        salary: [0, Validators.required],
        gender: ['', Validators.pattern('^[MFX]$')],
        email: ['', Validators.email]
    });

    get name(): AbstractControl<string> { return <AbstractControl<string>>this.employeeForm.get('name'); }
    get dateOfBirth(): AbstractControl<string> { return <AbstractControl<string>>this.employeeForm.get('dateOfBirth'); }
    get city(): AbstractControl<string> { return <AbstractControl>this.employeeForm.get('city'); }
    get salary(): AbstractControl<number> { return <AbstractControl<number>>this.employeeForm.get('salary'); }
    get gender(): AbstractControl<string> { return <AbstractControl<string>>this.employeeForm.get('gender'); }
    get email(): AbstractControl<string> { return <AbstractControl<string>>this.employeeForm.get('email'); }

    async onSubmit() {
        const employee: Employee = new Employee(
            this.name.value,
            new Date(this.dateOfBirth.value),
            this.city.value,
            this.salary.value,
            this.gender.value,
            this.email.value
        );

        try {
            // Save to Firestore
            const docRef = await addDoc(collection(db, "employees"), {
                name: employee.name,
                dateOfBirth: employee.dateOfBirth,
                city: employee.city,
                salary: employee.salary,
                gender: employee.gender,
                email: employee.email
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }

        this.employeeService.addEmployee(employee);
        this.employeeForm.reset();
        this.router.navigate(['/employees']).then(() => {});
    }
}
