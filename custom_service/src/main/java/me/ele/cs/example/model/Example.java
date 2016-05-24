package me.ele.cs.example.model;

import me.ele.cs.common.BaseVo;

public class Example extends BaseVo<Example>{
    
    /**
     * 
     */
    private static final long serialVersionUID = -2731547178992732269L;

    private String name;
    
    private Integer age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }
}
