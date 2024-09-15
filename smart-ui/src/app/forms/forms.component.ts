import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IrisService } from '../services/iris.service';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy {
  type: string | undefined;
  private sub: any;
  public isLoading = true;
  public chartOptions = {}
  
  public personForm = new UntypedFormGroup({
    Name: new UntypedFormControl('', {nonNullable: true, validators: [Validators.required]}),
    Lastname: new UntypedFormControl('', {nonNullable: true, validators: [Validators.required]}),
    Gender: new UntypedFormControl('', {nonNullable: true, validators: [Validators.required]}),
    BirthDate: new UntypedFormControl('', {nonNullable: true, validators: [Validators.required]}),
    Phone: new UntypedFormControl('', {nonNullable: true, validators: [Validators.required]}),
    Email: new UntypedFormControl({value: '', disabled: true}, {nonNullable: true, validators: [Validators.required]}),
    Identifier: new UntypedFormControl('', {nonNullable: true, validators: [Validators.required]}),
  })

  public heartRateForm = new UntypedFormGroup({
    HeartRate: new UntypedFormControl('', {nonNullable: true, validators: [Validators.required]})
  })

  public weightForm = new UntypedFormGroup({
    Weight: new UntypedFormControl('', {nonNullable: true, validators: [Validators.required]})
  })

  public bloodForm = new UntypedFormGroup({
    Systolic: new UntypedFormControl('', {nonNullable: true, validators: [Validators.required]}),
    Dyastolic: new UntypedFormControl('', {nonNullable: true, validators: [Validators.required]})
  })

  constructor(private route: ActivatedRoute,
      private irisService: IrisService,
      public auth: AuthService,
      private router: Router
    ) {}
  
  ngOnInit() {
    this.personForm.reset();
    this.heartRateForm.reset();
    this.weightForm.reset();
    this.bloodForm.reset();
    this.sub = this.route.params.subscribe(params => {
       this.type = params['type'];
       this.auth.user$.subscribe(
        authResponse => {
            this.email?.setValue(authResponse?.email);
            if (sessionStorage.getItem("personId") !== null){
              const reference = sessionStorage.getItem("personId");
              this.irisService.getObservations(reference!==null?reference:"").subscribe(
                res => {
                    var dataChart1 = [];
                    var dataChart2 = [];
                    var titleChart = "";
                    if (res.total > 0){
                      for (var entry of res.entry) {
                        const keyDate = entry.resource.effectiveDateTime.split("T")[0].split("-")
                        const keyTime = entry.resource.effectiveDateTime.split("T")[1].split(":")
                        if (entry.resource.code.text === "Heart rate" && this.type === "heart"){
                          dataChart1.push({label: keyDate[2]+"/"+keyDate[1]+" "+keyTime[0]+":"+keyTime[1], y: entry.resource.valueQuantity.value});
                          titleChart = entry.resource.code.text
                        }
                        else if (entry.resource.code.text === "Blood pressure systolic & diastolic"  && this.type === "blood")
                        {
                          dataChart1.push({label: keyDate[2]+"/"+keyDate[1]+" "+keyTime[0]+":"+keyTime[1], y: entry.resource.component[0].valueQuantity.value});
                          dataChart2.push({label: keyDate[2]+"/"+keyDate[1]+" "+keyTime[0]+":"+keyTime[1], y: entry.resource.component[1].valueQuantity.value});
                          titleChart = entry.resource.code.text
                        }
                        else if (entry.resource.code.text === "Body Weight"  && this.type === "weight")
                        {
                          dataChart1.push({label: keyDate[2]+"/"+keyDate[1]+" "+keyTime[0]+":"+keyTime[1], y: entry.resource.valueQuantity.value});
                          titleChart = entry.resource.code.text
                        }
                      }
                    }

                    if (this.type === "heart" || this.type === "weight") {
                      this.chartOptions = {
                        title: {
                          text: titleChart
                        },
                        data: [{
                          type: "line",
                          dataPoints: dataChart1
                        }]                
                      };
                    }
                    else if (this.type === "blood") {
                      this.chartOptions = {
                        title: {
                          text: titleChart
                        },
                        data: [{
                          type: "line",
                          name: "Systolic",
                          dataPoints: dataChart1
                        },
                        {
                          type: "line",
                          name: "Systolic",
                          dataPoints: dataChart2
                        }
                      ]                
                      };
                    }
                    this.isLoading = false;
                }
               );
            }
            else {{
              this.isLoading = false;
            }}
            
        }
      ); 
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get name() {
    return this.personForm.get('Name');
  }

  get lastname() {
    return this.personForm.get('Lastname');
  }

  get gender() {
    return this.personForm.get('Gender');
  }

  get birthDate() {
    return this.personForm.get('BirthDate');
  }

  get heartRate() {
    return this.heartRateForm.get('HeartRate');
  }

  get email() {
    return this.personForm.get('Email');
  }

  get identifier() {
    return this.personForm.get('Identifier');
  }

  get phone() {
    return this.personForm.get('Phone');
  }

  get systolic() {
    return this.bloodForm.get('Systolic');
  }

  get dyastolic() {
    return this.bloodForm.get('Dyastolic');
  }

  get weight() {
    return this.weightForm.get('Weight');
  }

  onSubmitHeart(): void {

    var datenow = new Date();
    var milliseconds = datenow.getTime();
    
    const observation = {
        "resourceType" : "Observation",
        "id" : "heart-rate",
        "text" : {
          "status" : "generated",
          "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative with Details</b></p><p><b>id</b>: heart-rate</p><p><b>meta</b>: </p><p><b>status</b>: final</p><p><b>category</b>: Vital Signs <span>(Details : {http://terminology.hl7.org/CodeSystem/observation-category code 'vital-signs' = 'Vital Signs', given as 'Vital Signs'})</span></p><p><b>code</b>: Heart rate <span>(Details : {LOINC code '8867-4' = 'Heart rate', given as 'Heart rate'})</span></p><p><b>subject</b>: <a>Patient/example</a></p><p><b>effective</b>: Jul 2, 1999</p><p><b>value</b>: "+this.heartRate?.value+" beats/minute<span> (Details: UCUM code /min = '/min')</span></p></div>"
        },
        "identifier" : [{
          "use" : "official",
          "system" : "http://localhost:4200/smartui/identifiers/observations",
          "value" : milliseconds.toString
        }],
        "status" : "final",
        "category": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "vital-signs",
                "display": "Vital Signs"
              }
            ],
            "text": "Vital Signs"
          }
        ],
        "code": {
          "coding": [
            {
              "system": "http://loinc.org",
              "code": "8867-4",
              "display": "Heart rate"
            }
          ],
          "text": "Heart rate"
        },
        "subject" : {
          "reference" : "Patient/"+sessionStorage.getItem("personId"),
          "display" : sessionStorage.getItem("personName")
        },
        "effectiveDateTime" : datenow,
        "valueQuantity" : {
          "value" : +this.heartRate?.value,
          "unit" : "BPM",
          "system" : "http://unitsofmeasure.org",
          "code" : "BPM"
        }
    }
    
    this.irisService.saveObservation(observation).subscribe({next: res => {
      this.ngOnInit();
    },
    error: err => {
      console.error(JSON.stringify(err));
    }
  });
  }

  onSubmitPerson(): void {
    const patientData = {
      "resourceType": "Patient",
      "birthDate": this.birthDate?.value.getFullYear()+"-"+(1 + this.birthDate?.value.getMonth()).toString().padStart(2, '0')+"-"+this.birthDate?.value.getDate().toString().padStart(2, '0'),
      "gender": this.gender?.value,
      "identifier": [
          {
              "type": {
                  "text": "ID"
              },
              "value": this.identifier?.value
          }
      ],
      "name": [
          {
              "family": this.lastname?.value,
              "given": [
                  this.name?.value
              ]
          }
      ],
      "telecom": [
          {
              "system": "phone",
              "value": this.phone?.value
          },
          {
              "system": "email",
              "value": this.email?.value
          }
      ]
      };

      this.irisService.savePatient(patientData).subscribe({next: res => {  
        this.router.navigate(['home']);
      },
      error: err => {
      console.error(JSON.stringify(err));
      }
      });
  }

  onSubmitBlood(): void {

    var datenow = new Date();
    var milliseconds = datenow.getTime();
    
    const observation = {
      "resourceType" : "Observation",
      "id" : "blood-pressure",
      "meta" : {
        "profile" : ["http://hl7.org/fhir/StructureDefinition/vitalsigns"]
      },
      "text" : {
        "status" : "generated",
        "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative: Observation</b><a name=\"blood-pressure\"> </a></p><div style=\"display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%\"><p style=\"margin-bottom: 0px\">Resource Observation &quot;blood-pressure&quot; </p><p style=\"margin-bottom: 0px\">Profile: <a href=\"vitalsigns.html\">Vital Signs Profile</a></p></div><p><b>identifier</b>: id:\u00a0<a href=\"http://terminology.hl7.org/5.4.0/NamingSystem-uri.html\">#</a>urn:uuid:187e0c12-8dd2-67e2-99b2-bf273c878281</p><p><b>basedOn</b>: <span title=\"   demonstrating the use of the baseOn element with a fictive identifier \"><span>id:\u00a01234</span></span></p><p><b>status</b>: final</p><p><b>category</b>: Vital Signs <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"http://terminology.hl7.org/5.4.0/CodeSystem-observation-category.html\">Observation Category Codes</a>#vital-signs)</span></p><p><b>code</b>: Blood pressure systolic &amp; diastolic <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"https://loinc.org/\">LOINC</a>#85354-9 &quot;Blood pressure panel with all children optional&quot;)</span></p><p><b>subject</b>: <a href=\"patient-example.html\">Patient/example</a> &quot;Peter CHALMERS&quot;</p><p><b>effective</b>: 2012-09-17</p><p><b>performer</b>: <a href=\"practitioner-example.html\">Practitioner/example</a> &quot;Adam CAREFUL&quot;</p><p><b>interpretation</b>: <span title=\"    an interpretation offered to the combination observation\n        generally, it would only be appropriate to offer an interpretation\n        of an observation that has no value if it has &quot;COMP&quot; (component)\n        observations    \">Below low normal <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"http://terminology.hl7.org/5.4.0/CodeSystem-v3-ObservationInterpretation.html\">ObservationInterpretation</a>#L &quot;low&quot;)</span></span></p><p><b>bodySite</b>: <span title=\" The BodySite can be captured in a LOINC code but am showing it here to demonstrate populating the element  \">Right arm <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"https://browser.ihtsdotools.org/\">SNOMED CT</a>#368209003)</span></span></p><blockquote><p><b>component</b></p><p><b>code</b>: <span title=\" \n           Observations are often coded in multiple code systems.\n           - LOINC provides a very specific code (though not more specific in this particular case)\n           - snomed provides a clinically relevant code that is usually less granular than LOINC\n           - the source system provides its own code, which may be less or more granular than LOINC\n\nthis is shown here to demonstrate  the concept of translations within the codeableConcept datatype. The diastolic code below only has a LOINC code\n            \">Systolic blood pressure <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"https://loinc.org/\">LOINC</a>#8480-6; <a href=\"https://browser.ihtsdotools.org/\">SNOMED CT</a>#271649006; clinical-codes#bp-s &quot;Systolic Blood pressure&quot;)</span></span></p><p><b>value</b>: 107 mmHg<span style=\"background: LightGoldenRodYellow\"> (Details: UCUM code mm[Hg] = 'mmHg')</span></p><p><b>interpretation</b>: <span title=\"    an interpretation for the individual composite observation  \">Normal <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"http://terminology.hl7.org/5.4.0/CodeSystem-v3-ObservationInterpretation.html\">ObservationInterpretation</a>#N &quot;normal&quot;)</span></span></p></blockquote><blockquote><p><b>component</b></p><p><b>code</b>: <span title=\"    this codes only has a LOINC code    \">Diastolic blood pressure <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"https://loinc.org/\">LOINC</a>#8462-4)</span></span></p><p><b>value</b>: 60 mmHg<span style=\"background: LightGoldenRodYellow\"> (Details: UCUM code mm[Hg] = 'mmHg')</span></p><p><b>interpretation</b>: <span title=\"    an interpretation for the individual composite observation  \">Below low normal <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"http://terminology.hl7.org/5.4.0/CodeSystem-v3-ObservationInterpretation.html\">ObservationInterpretation</a>#L &quot;low&quot;)</span></span></p></blockquote></div>"
      },
      "identifier" : [{
        "use" : "official",
        "system" : "http://localhost:4200/smartui/identifiers/observations",
        "value" : milliseconds.toString
      }],
      "status" : "final",
      "category" : [{
        "coding" : [{
          "system" : "http://terminology.hl7.org/CodeSystem/observation-category",
          "code" : "vital-signs",
          "display" : "Vital Signs"
        }]
      }],
      "code" : {
        "coding" : [{
          "system" : "http://loinc.org",
          "code" : "85354-9",
          "display" : "Blood pressure panel with all children optional"
        }],
        "text" : "Blood pressure systolic & diastolic"
      },
      "subject" : {
        "reference" : "Patient/"+sessionStorage.getItem("personId"),
        "display" : sessionStorage.getItem("personName")
      },
      "effectiveDateTime" : datenow,
      "performer" : [{
        "reference" : "Patient/"+sessionStorage.getItem("personId")
      }],
      "component" : [{
        "code" : {
          "coding" : [{
            "system" : "http://loinc.org",
            "code" : "8480-6",
            "display" : "Systolic blood pressure"
          },
          {
            "system" : "http://snomed.info/sct",
            "code" : "271649006",
            "display" : "Systolic blood pressure"
          },
          {
            "system" : "http://acme.org/devices/clinical-codes",
            "code" : "bp-s",
            "display" : "Systolic Blood pressure"
          }]
        },
        "valueQuantity" : {
          "value" : +this.systolic?.value,
          "unit" : "mmHg",
          "system" : "http://unitsofmeasure.org",
          "code" : "mm[Hg]"
        }
      },
      {
        "code" : {
          "coding" : [{
            "system" : "http://loinc.org",
            "code" : "8462-4",
            "display" : "Diastolic blood pressure"
          }]
        },
        "valueQuantity" : {
          "value" : +this.dyastolic?.value,
          "unit" : "mmHg",
          "system" : "http://unitsofmeasure.org",
          "code" : "mm[Hg]"
        },
      }]
    }
    
    this.irisService.saveObservation(observation).subscribe({next: res => {
      this.ngOnInit();
    },
    error: err => {
      console.error(JSON.stringify(err));
    }
  });
  }

  onSubmitWeight(): void {

    var datenow = new Date();
    var milliseconds = datenow.getTime();
    
    const observation = {
      "resourceType" : "Observation",
      "id" : "example",
      "text" : {
        "status" : "generated",
        "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative: Observation</b><a name=\"example\"> </a></p><div style=\"display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%\"><p style=\"margin-bottom: 0px\">Resource Observation &quot;example&quot; </p></div><p><b>status</b>: <span title=\"   the mandatory quality flags:   \">final</span></p><p><b>category</b>: <span title=\"  category code is A code that classifies the general type of observation being made. This is used for searching, sorting and display purposes. \">Vital Signs <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"http://terminology.hl7.org/5.4.0/CodeSystem-observation-category.html\">Observation Category Codes</a>#vital-signs)</span></span></p><p><b>code</b>: <span title=\"  \n    Observations are often coded in multiple code systems.\n      - LOINC provides codes of varying granularity (though not usefully more specific in this particular case) and more generic LOINCs  can be mapped to more specific codes as shown here\n      - snomed provides a clinically relevant code that is usually less granular than LOINC\n      - the source system provides its own code, which may be less or more granular than LOINC\n    \">Body Weight <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"https://loinc.org/\">LOINC</a>#29463-7; <a href=\"https://loinc.org/\">LOINC</a>#3141-9 &quot;Body weight Measured&quot;; <a href=\"https://browser.ihtsdotools.org/\">SNOMED CT</a>#27113001 &quot;Body weight&quot;; clinical-codes#body-weight)</span></span></p><p><b>subject</b>: <a href=\"patient-example.html\">Patient/example</a> &quot;Peter CHALMERS&quot;</p><p><b>encounter</b>: <a href=\"encounter-example.html\">Encounter/example</a></p><p><b>effective</b>: 2016-03-28</p><p><b>value</b>: <span title=\"   In FHIR, units may be represented twice. Once in the\n    agreed human representation, and once in a coded form.\n    Both is best, since it's not always possible to infer\n    one from the other in code.\n\n    When a computable unit is provided, UCUM (http://unitsofmeasure.org)\n    is always preferred, but it doesn't provide notional units (such as\n    &quot;tablet&quot;), etc. For these, something else is required (e.g. SNOMED CT)\n     \">185 lbs<span style=\"background: LightGoldenRodYellow\"> (Details: UCUM code [lb_av] = 'lb_av')</span></span></p></div>"
      },
      "identifier" : [{
        "use" : "official",
        "system" : "http://localhost:4200/smartui/identifiers/observations",
        "value" : milliseconds.toString
      }],
      "status" : "final",
      "category" : [{
        "coding" : [{
          "system" : "http://terminology.hl7.org/CodeSystem/observation-category",
          "code" : "vital-signs",
          "display" : "Vital Signs"
        }]
      }],
      "code" : {
        "coding" : [{
          "system" : "http://loinc.org",
          "code" : "29463-7",
          "display" : "Body Weight"
        },
        {
          "system" : "http://loinc.org",
          "code" : "3141-9",
          "display" : "Body weight Measured"
        },
        {
          "system" : "http://snomed.info/sct",
          "code" : "27113001",
          "display" : "Body weight"
        },
        {
          "system" : "http://acme.org/devices/clinical-codes",
          "code" : "body-weight",
          "display" : "Body Weight"
        }],
        "text": "Body Weight"
      },
      "subject" : {
        "reference" : "Patient/"+sessionStorage.getItem("personId")
      },
      "performer" : [{
        "reference" : "Patient/"+sessionStorage.getItem("personId")
      }],
      "effectiveDateTime" : datenow,
      "valueQuantity" : {
        "value" : +this.weight?.value,
        "unit" : "kg",
        "system" : "http://unitsofmeasure.org",
        "code" : "[kg_av]"
      }
    }
    
    this.irisService.saveObservation(observation).subscribe({next: res => {
      this.ngOnInit();
    },
    error: err => {
      console.error(JSON.stringify(err));
    }
  });
  }

  cancel() {
    this.router.navigate(["home"]);
  }
}
