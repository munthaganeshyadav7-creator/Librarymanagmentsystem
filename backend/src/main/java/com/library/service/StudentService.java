package com.library.service;

import com.library.dto.LoginRequest;
import com.library.dto.RegisterRequest;
import com.library.entity.Student;
import com.library.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;

    @Autowired
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student register(RegisterRequest request) {
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered: " + request.getEmail());
        }

        String role = request.getRole();
        if (role == null || role.trim().isEmpty()) {
            role = "STUDENT";
        }

        Student student = new Student(
                request.getName(),
                request.getEmail().trim().toLowerCase(),
                request.getPassword(), // In production, hash with BCrypt
                request.getPhone(),
                role.toUpperCase()
        );

        return studentRepository.save(student);
    }

    public Student login(LoginRequest request) {
        Optional<Student> studentOpt = studentRepository.findByEmail(request.getEmail().trim().toLowerCase());
        if (studentOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        Student student = studentOpt.get();
        // Plaintext comparison for technical training project / simple auth
        if (!student.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return student;
    }

    @Transactional(readOnly = true)
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Student updateStudent(Long id, Student studentDetails) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + id));

        student.setName(studentDetails.getName());
        student.setPhone(studentDetails.getPhone());
        if (studentDetails.getRole() != null) {
            student.setRole(studentDetails.getRole().toUpperCase());
        }
        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new IllegalArgumentException("Student not found with ID: " + id);
        }
        studentRepository.deleteById(id);
    }
}
