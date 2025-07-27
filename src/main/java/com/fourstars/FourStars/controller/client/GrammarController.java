package com.fourstars.FourStars.controller.client;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fourstars.FourStars.domain.response.ResultPaginationDTO;
import com.fourstars.FourStars.domain.response.grammar.GrammarResponseDTO;
import com.fourstars.FourStars.service.GrammarService;
import com.fourstars.FourStars.util.annotation.ApiMessage;
import com.fourstars.FourStars.util.error.ResourceNotFoundException;

@RestController("clientGrammarController")
@RequestMapping("/api/v1/grammars")
public class GrammarController {

    private final GrammarService grammarService;

    public GrammarController(GrammarService grammarService) {
        this.grammarService = grammarService;
    }

    @GetMapping("/{id}")
    @ApiMessage("Fetch a grammar lesson by its ID")
    public ResponseEntity<GrammarResponseDTO> getGrammarById(@PathVariable long id) throws ResourceNotFoundException {
        GrammarResponseDTO grammar = grammarService.fetchGrammarById(id);
        return ResponseEntity.ok(grammar);
    }

    @GetMapping
    @ApiMessage("Fetch all grammar lessons with pagination and filtering")
    public ResponseEntity<ResultPaginationDTO<GrammarResponseDTO>> getAllGrammars(
            Pageable pageable,
            @RequestParam(name = "categoryId", required = false) Long categoryId,
            @RequestParam(name = "name", required = false) String name) {
        ResultPaginationDTO<GrammarResponseDTO> result = grammarService.fetchAllGrammars(pageable, categoryId, name);
        return ResponseEntity.ok(result);
    }
}
