package com.example.REM_Backend.Repository;

import com.example.REM_Backend.Entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertiesRepository extends JpaRepository<Property,Long> {
}
