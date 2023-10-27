package IngOn.IngredientSubstitution.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class webController {

    @GetMapping("/")
    public String homePage() {
        return "homePage";
    }

    @GetMapping("/aboutus")
    public String aboutUs() { return "aboutUs"; }
}
