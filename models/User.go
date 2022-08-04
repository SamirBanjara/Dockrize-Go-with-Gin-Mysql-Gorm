package models

type User struct {
	ID            int    `json:"id"`
	PublicKey     string `json:"pb"`
	Nonce         string `json:"nonce"`
	Signature     string `json:"sig"`
	Name          string `json:"name"`
	Role          string `json:"role"`
	Address       string `json:"address"`
	Email         string `json:"email"`
	SSN           string `json:"ssn"`
	SEX           string `json:"sex"`
	Annual_Salary string `json:"annual_salary"`
	Post          string `json:"post"`
}
